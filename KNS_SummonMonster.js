//=============================================================================
// KNS_SummonMonster.js
//=============================================================================
/*:
 * @plugindesc (v1.0) 召喚獣のアクターを設定します。
 * @author 莞爾の草
 *
 * @help
 * ■使い方
 * 　ステートのメモ欄に下記のように書くとそのステートに
 * かかっている間、nのIDのアクターが召喚されます。
 * <召喚:n>
 * （nに整数）
 * 
 * ■召喚獣のシステム
 * 　召喚獣のレベルは召喚者のレベルと同じになり、召喚時に
 * HP、MPがマックスの状態で呼び出されます。
 * 
 * 　戦闘終了時、召喚者の召喚状態が解除されたとき、
 * 召喚者か召喚獣が倒されたときに消えてしまいます。
 * 
 * 全てのプラグインの下に置いてください。
 */
(function () {
	var loadedadditionalParams = true;
	const summonActorsID = [], summonStatesID = [], term = "召喚";

	const __kanjiLoadInfos = Scene_Boot.prototype.terminate;
	Scene_Boot.prototype.terminate = function() {
		__kanjiLoadInfos.call(this);
		if (loadedadditionalParams) {
			$dataStates.forEach(state => {
				if (state && state.meta[term]) {
					summonStatesID.push(state.id);
					summonActorsID.push(parseInt(state.meta[term]));
				};
			});
			loadedadditionalParams = false;
		};
	};


	function summonIndex (stateId) {
		return summonStatesID.findIndex(id => id == stateId);
	}

	function removeAllSummons () {
		summonActorsID.forEach(id => $gameParty.removeActor(id));
	}

	const _addState = Game_Actor.prototype.addState;
	Game_Actor.prototype.addState = function(stateId) {
		if (this.isStateAddable(stateId) && !this.isStateAffected(stateId)) {
			var index = summonIndex(stateId);
			if (index !== -1) {
				var id = summonActorsID[index];
				var actor = $gameActors.actor(id);
				actor.setup(id);
				while (actor._level < this._level) actor.levelUp();
				actor.summonerId = this.actorId();
				actor.recoverAll();
				$gameParty.addActor(actor.actorId());
				SceneManager._scene.update();
			}
		}
		_addState.apply(this, arguments);
	};

	const _removeState = Game_Actor.prototype.removeState;
	Game_Actor.prototype.removeState = function(stateId) {
		if (this.isStateAffected(stateId)) {
			var index = summonIndex(stateId);
			if (index !== -1) $gameParty.removeActor(summonActorsID[index]);
		}
		_removeState.apply(this, arguments);
	};

	const _clearStates = Game_Actor.prototype.clearStates;
	Game_Actor.prototype.clearStates = function() {
		_clearStates.call(this);
		removeAllSummons();
	};


	function mogIs2 (complex) {
		for (this.work; maybe; spend = 2) "muchTime";
		return back;
	}
})()