//=============================================================================
// OrderOpposite.js
//=============================================================================

/*:
 * @plugindesc When a battler has certain state, all battlers act in order starting with the slowest.
 * @author Kanji the Grass
 *
 * @help You can specify the certain state by writing 
 * the plug-in command, CertainStateTerm on the note of state.
 *
 * @param CertainStateTerm
 * @desc A term to specify certain state or not.
 * @default <OrderOpposite>
 *
 * @param OddJugde
 * @desc If you set true, order reversal occurs when the size of members who has certain state is odd.
 * If you set false, it occurs when the size is over then 0.
 * @type boolean
 * @default false
 *
 */

/*:ja
 * @plugindesc 敵か味方が特定のステートの時、戦闘全体で遅いほうから行動するようになります。
 * @author 莞爾の草
 *
 * @help プラグインコマンドCertainStateTermの中身をステートの
 * メモ欄に書くことで特定のステートを指定できます。
 *
 * @param CertainStateTerm
 * @desc メモ欄で特定のステートか特定するための単語です。
 * @default <順番逆転>
 *
 * @param OddJugde
 * @desc trueにすると奇数人数かかっているときだけ逆転させる。
 * falseだと1人以上で逆転。
 * @type boolean
 * @default false
 *
 */

(function() {
    var parameters = PluginManager.parameters('OrderOpposite');
    var certainStateTerm = String(parameters['CertainStateTerm'] || '<順番逆転>');
	var oddJugde = eval(parameters['OddJugde']) || false;

	BattleManager.isReversalSpeed = function () {
		const field = $gameParty.battleMembers().concat($gameTroop.aliveMembers());
		let count = 0
		field.forEach(battler => {
			battler.states().forEach(state => {
				if (state.note.includes(certainStateTerm)) count++;
			});
		});
		return oddJugde ? count % 2 == 1 : count > 0;
	}

	const _Game_Action_speed = Game_Action.prototype.speed;
	Game_Action.prototype.speed = function() {
		var speed = _Game_Action_speed.call(this);
		if (BattleManager.isReversalSpeed()) {
			var agi = this.subject().agi;
			speed -= agi;
			speed += this.subject().paramMax(6) - agi;
		}
		return speed;
	};

})();

