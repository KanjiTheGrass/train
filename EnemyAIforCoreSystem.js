/*
 * ===========================================================================
 * EnemyAIforCoreSystem.js
 * ---------------------------------------------------------------------------
 * version 1.05 demo
 * Copyright (c) 2020 Kanji the Grass
 * This work is provided under the MTCM Blue License
 * - https://en.materialcommons.tk/mtcm-b-summary/
 * Credits display: Kanji the Grass order by Munokura fungamemake.com
 * ===========================================================================
*/
/*:
 * @plugindesc MainCoreBattleSystemの下に置いてください。
 * @author 莞爾の草
 *
 * @help
 * スキルのメモ欄に下記の文言を書くことで使えます。
 * 
 * <メイン状態中禁止:1 2 5 拘束中>
 * <コア状態中禁止:1 2 5 拘束中>
 * 　敵は主人公が特定のステートの時は拘束攻撃・指定したスキルは使用しないようにする
 * 　ターンの途中、メインかコアがその状態になると行動は無効になります。
 * 　次のターンからはその技は使用候補から外され、状態が解除すると元に戻ります。
 * 
 * <メイン状態のみ:1 3 6 拘束中>
 * <コア状態のみ:1 3 6 拘束中>
 * 　敵は主人公がその状態のときのみそのスキルを使用するようにする。
 * 　ターンの途中、メインかコアのその状態が解除されると行動は無効になります。
 * 　次のターンからはその技が使用候補から外され、その状態に戻ると元に戻ります。
 * 
 * <メイン対象>
 * <コア対象>
 * 　主人公にしか使用しない、またはコアにしか使用しないスキルです。
 * 　コア対象のスキルはメインが生きている間は使われません。
 * 
 *
 * ■利用規約
 * この作品は マテリアル・コモンズ・ブルー・ライセンスの下に提供されています。
 * - https://materialcommons.tk/mtcm-b-summary/
 * クレジット表示：莞爾の草 (仕様作成:ムノクラ fungamemake.com )
 *
 * ライセンス内容を確認の上、ご利用ください。
 */

(function () {
	"use strict";
	let loadedadditionalParams = true;
	const mainFix = "メイン対象", coreFix = "コア対象", bind = "拘束中";

	const __kanjiLoadInfos = Scene_Boot.prototype.terminate;
	Scene_Boot.prototype.terminate = function() {
		__kanjiLoadInfos.call(this);
		if (loadedadditionalParams) {
			var bindStates = []
			$dataStates.forEach(item => {if (item && item.meta[bind]) bindStates.push(item.id)});

			const mainStateBan = "メイン状態中禁止", coreStateBan = "コア状態中禁止",
			mainStateOnly = "メイン状態のみ", coreStateOnly = "コア状態のみ";
			$dataSkills.forEach(item => {
				if (item) { 
					item.__knsMetaMainState = [];
					item.__knsMetaCoreState = [];
					item.__knsMetaMainOnly = [];
					item.__knsMetaCoreOnly = [];
					if (item.meta) {
						for (var key in item.meta) {
							var a = key == mainStateBan, b = key == coreStateBan,
							c = key == mainStateOnly, d = key == coreStateOnly;
							if (a || b || c || d) {
								var data = item.meta[key].split(" ").map(param => {
									return param == bind ? bindStates : parseInt(param);
								});
								data = [].concat(...data);

								if (a) {
									item.__knsMetaMainState = item.__knsMetaMainState.concat(data);
								}else if (b){
									item.__knsMetaCoreState = item.__knsMetaCoreState.concat(data);
								}else if (c){
									item.__knsMetaMainOnly  = item.__knsMetaMainOnly .concat(data);
								}else{
									item.__knsMetaCoreOnly  = item.__knsMetaCoreOnly .concat(data);
								}
							}
						}
						item.__knsMetaMainState = [...new Set(item.__knsMetaMainState)];
						item.__knsMetaCoreState = [...new Set(item.__knsMetaCoreState)];
						item.__knsMetaMainOnly  = [...new Set(item.__knsMetaMainOnly)];
						item.__knsMetaCoreOnly  = [...new Set(item.__knsMetaCoreOnly)];
					}
				}
			});

			loadedadditionalParams = false
		}
	};

	Game_Party.prototype.knsCoreMembers = function () {
		return this.battleMembers().filter(actor => actor.isCoreCharacter());
	}

	const __targetsForOpponents = Game_Action.prototype.targetsForOpponents;
	Game_Action.prototype.targetsForOpponents = function() {
		var skill = this._item;
		if (this.subject().isEnemy() && skill._dataClass == "skill") {
			skill = $dataSkills[skill._itemId];
			var num = this.numTargets() || 1, data, array = [];
			if (skill.meta[mainFix]) {
				data = $gameParty.knsMainMembers()[0];
				for (var i =0;i < num;i++) array[i] = data;
				return array;
			}else if (skill.meta[coreFix]){
				data = $gameParty.knsCoreMembers()[0];
				for (var i =0;i < num;i++) array[i] = data;
				return array;
			}else{
				return __targetsForOpponents.apply(this, arguments);
			}
		}
		return __targetsForOpponents.apply(this, arguments);
	};
	
	Game_Enemy.prototype.skillUsableByState = function (item) {
		if (!item) return false;
		const skill = $dataSkills[item.id],
		main = $gameParty.knsMainMembers()[0], core = $gameParty.knsCoreMembers()[0];

		var mBool = true, cBool = true;
		var funk = (actor, id) => actor.isStateAffected(id);
		if (main) {
			// メインがその状態なら禁止
			// スキルが禁止されておらずその状態のときのみ使用
			mBool = !skill.__knsMetaMainState.some(s => funk(main, s)) && 
			(skill.__knsMetaMainOnly.length == 0 || skill.__knsMetaMainOnly.some(s => funk(main, s)));
		}
		if (core) {
			cBool = !skill.__knsMetaCoreState.some(s => funk(core, s)) && 
			(skill.__knsMetaCoreOnly.length == 0 || skill.__knsMetaCoreOnly.some(s => funk(core, s)));
		}
		return mBool && cBool;
	}

	Game_Enemy.prototype.skillForCore = function (skill) {
		if (!skill) return false;
		return  skill.meta[coreFix] ? 
				$gameParty.knsMainMembers().every(a => a.isDead() || a.boundState()) : true
	}

	const __meetsUsableItemConditions = Game_Enemy.prototype.meetsUsableItemConditions;
	Game_Enemy.prototype.meetsUsableItemConditions = function(item) {
		return __meetsUsableItemConditions.call(this, item) && this.skillUsableByState(item) && 
		this.skillForCore(item);
	};

	const __isActionValid = Game_Enemy.prototype.isActionValid;
	Game_Enemy.prototype.isActionValid = function(action) {
		var skill = $dataSkills[action.skillId];
		return  __isActionValid.call(this, action) && this.skillUsableByState(skill) && this.skillForCore(skill);
	};
})();