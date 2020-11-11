/*
 * ===========================================================================
 * DebugModeEvent.js
 * ---------------------------------------------------------------------------
 * version 1.00
 * Copyright (c) 2020 Kanji the Grass
 * This work is provided under the MTCM Blue License
 * - https://en.materialcommons.tk/mtcm-b-summary/
 * Credits display: Kanji the Grass
 * ===========================================================================
*/
/*:
 * @plugindesc デプロイ前確認。デバッグモードで立ち上げたときに特別なイベントを起こすプラグインです。
 * @author 莞爾の草
 * 
 * @param StartMap
 * @text 開始マップID
 * @default 1
 * @type number
 * @desc デバッグモードで開かれたとき、最初に読み込まれるマップのIDを指定してください。
 *
 * @param StartingMember
 * @text 開始メンバー
 * @default [1]
 * @type number[]
 * @desc デバッグモードで開かれたとき、パーティにいるメンバーを選べます。
 *
 * @param PlayerX
 * @text プレイヤーX座標
 * @default 1
 * @type number
 * @desc デバッグモードで開かれたとき、プレイヤーのいるX座標を選択してください。
 *
 * @param PlayerY
 * @text プレイヤーY座標
 * @default 1
 * @type number
 * @desc デバッグモードで開かれたとき、プレイヤーのいるY座標を選択してください。
 *
 * @param playerVisible
 * @text プレイヤーを透明にするか
 * @type boolean
 * @default false
 * @desc デバッグモードで開かれたとき、ﾌﾟﾚｲﾔを透明状態で表示するかです。ONなら透明、OFFなら非透明。
 *
 * @help
 * ネタプラグインです。
 * デバッグモードで開かれたときに指定のマップに飛ばし、特別なイベントを起こせるようにするプラグインです。
 * 早い話がデバッグモードで悪いことをしようとしているプレイヤーに対する嫌がらせです。
 * 誰にも見られず終わる可能性も大いにありますが、ないよりは面白いと思います。知らんけど。
 * 
 * 作者がテストプレイで開いた時も暴発するのでデプロイ前にのみONにしてください。
 *
 * ■利用規約
 * この作品は マテリアル・コモンズ・ブルー・ライセンスの下に提供されています。
 * - https://materialcommons.tk/mtcm-b-summary/
 * クレジット表示：莞爾の草
 * 
 * ライセンス内容を確認の上、ご利用ください。
 */
(function () {
	var param = PluginManager.parameters('DebugModeEvent');
	param.startMap = parseInt(param['StartMap'] || 1);
	param.playerX  = parseInt(param['PlayerX'] || 1);
	param.playerY  = parseInt(param['PlayerY'] || 1);
	param.playerVisible = eval(param['playerVisible']);
	param.startingMembers = eval(param['StartingMember']) || [1];
	
	'use strict';
	const __start = Scene_Boot.prototype.start;
	Scene_Boot.prototype.start = function() {
		if (Utils.isOptionValid('test')) {
			DataManager.createGameObjects();
			$gameParty._actors = param.startingMembers.map(id => parseInt(id));
			$gamePlayer.reserveTransfer(param.startMap, param.playerX, param.playerY);
			$gamePlayer.setTransparent(param.playerVisible);
			$gamePlayer.refresh();
			$gameTemp._isPlaytest = false;
			SceneManager.goto(Scene_Map);
			this.updateDocumentTitle();
		}else{
			__start.apply(this, arguments);
		}
	};
	
	
})();