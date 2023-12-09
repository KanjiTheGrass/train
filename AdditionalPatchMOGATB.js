//=============================================================================
// AdditionalPatchForMOG.js
//=============================================================================
/*:
 * MOG_ATB、MOG_ATB_Gaugeより下に入れてください。
 * @author 莞爾の草
 * 
 * @help
 * カットイン先読み機能付きです。戦闘メンバーのカットインの画像を
 * 戦闘に入った時点で読み込みます。
 * （戦闘中に入ってきた仲間、敵のカットインは読み込みません。）
 * ■利用規約
 * この作品は マテリアル・コモンズ・ブルー・ライセンスの下に提供されています。
 * - https://materialcommons.tk/mtcm-b-summary/
 * クレジット表示：莞爾の草 (仕様作成:ムノクラ fungamemake.com )
 *
 * ライセンス内容を確認の上、ご利用ください。
 */

(function () {

	var actorTurnOrder = [];
	const __additional_initialize = Scene_Battle.prototype.create;
	Scene_Battle.prototype.create = function() {
		actorTurnOrder.length = 0;
		__additional_initialize.call(this);
		// カットイン先読み
		$gameParty.members().forEach(actor => {
			var name = "Actor_" + actor.actorId();
			ImageManager.loadPicture(name);
			ImageManager.loadPicture(name + "_Fire");
		});
	};
	
	const __additional_executeATBFullEffect = BattleManager.executeATBFullEffect;
	BattleManager.executeATBFullEffect = function(battler) {
		__additional_executeATBFullEffect.apply(this, arguments);
		if (battler.isActor()) {
			actorTurnOrder.push(battler);
		};
	};
	
	BattleManager.prepareNextSubject_ATB = function(battler) {
		if (battler.isEnemy()) {
			this.prepareActionEnemy(battler);
		} else {
			if (battler.isConfused()) {  
				this.prepareConfusionActionActor(battler);
			} else if (this.needPrepareSelection(battler)) {	
				if (actorTurnOrder.length > 0) {
					actorTurnOrder = actorTurnOrder.filter(item => item.isMaxAtb() && item.canMove());
					var atbBattler = actorTurnOrder.shift();
				}
				this.prepareCommandSelection(atbBattler || battler);
			} else {
				if (battler._atbItem) {
					this._atbBattler = battler;
					battler._intTurn = true;
				};
			};
		};
	};
	
} )()