//=============================================================================
// KNS_ActorChoicePlugin.js demo 2
//=============================================================================
/*:
 * @plugindesc アクターを選択肢に表示して選択できるようにするプラグインです。
 * @author 莞爾の草
 *
 * @param NooneChosen
 * @text 該当キャラなしの選択肢
 * @desc 誰も条件にマッチしなかった時だけ表示される選択肢です。
 * @default （誰もいない）
 *
 * @help
 * ■使い方
 * 　イベントコマンド「選択肢の表示」の選択肢１に
 * 　#choice get=n
 * 　と書くと、選ばれたアクターＩＤが変数n番目に格納されます。
 * 　（キャンセル時は変数に0が、該当するキャラがいなかった時は
 * 　　変数に-1が入ります）
 * 
 * 　キャラが選ばれたときに起こすイベントは選択肢１の中に、
 * 　該当するキャラがいなかった時のイベントは選択肢２の中に、
 * 　キャンセル時のイベントは「選択肢の表示」のキャンセルの設定を
 * 　分岐にすると出てくる「キャンセルの中」に設定することができます。
 * 
 * 　選択肢の表示方法（位置、背景、キャンセルの種類）は通常の選択肢と同様の
 * 　方法で設定できます。
 * 　キャンセルの種類の設定は禁止と分岐以外は非推奨な使い方です
 * 　（該当のキャラがいない時にエラー）。
 * 　また、メッセージウィンドウの位置の中は対応していません。
 * 
 * 
 * ■選ばれるアクターの条件の追加方法
 * 　選択肢１～４に次の文字列を書き込むことで設定できます。
 * 　該当キャラがいないことが想定される場面では
 * 　選択肢は必ず二つ以上用意してください。
 * 
 * 〇条件一覧
 * 【アクター範囲設定】（以下重複不可）
 * 　この条件を省略するとパーティメンバーがアクターの範囲となります。
 * ALL
 * →データベース内のすべての名前設定済みのアクターを
 * 範囲として設定します。
 * 
 * OUT
 * →ALLからパーティメンバーをのぞいたものを
 * 　範囲として設定します。
 * 
 * 【範囲絞り込み】（以下重複可能）
 * state=n もしくは state!=n 
 * →前者はステートn番目状態のアクターが選ばれます。
 * 　後者はステートn番目状態でないアクターが選ばれます。
 * 
 * switch=n もしくは switch!=n
 * →スイッチの アクターのID - 1 + n 番目を参考に、それぞれの
 * 　アクターが選択可能かどうかを調べます。
 * 　前者はアクターのスイッチがONなら選択可能、後者は逆です。
 * 
 * ※範囲絞り込み条件は一つでも当てはまらないものがあるとマッチしません。
 * 　例えば、条件Aがマッチしたとしても、条件Bがマッチしていなければ
 * 　そのキャラは選ばれません（AかつBでマッチ）。
 * 
 * ■選択肢の例
 * 　選択肢1 #choice ALL get=4
 * 　選択肢2 state!=1 switch=2
 */

(function() {
    var parameters = PluginManager.parameters('KNS_ActorChoicePlugin');
    var noOneChosen = String(parameters['NooneChosen'] || "戻る");
    parameters = null;

    var getVariableID = 1;

    const setupChoices = Game_Interpreter.prototype.setupChoices;
    Game_Interpreter.prototype.setupChoices = function(params) {
        var choices = params[0];
        if (!$gameParty.inBattle() && choices[0].includes("#choice")) {
            var condition = choices.join(" ");
            var actorList;
            var out = condition.includes("OUT");
            if (condition.includes("ALL") || out) {
                actorList = []
                for (var i = 1;i < $dataActors.length;i++) {
                    var actor = $gameActors.actor(i);
                    if (actor.name() && (!out || !$gameParty._actors.contains(i))) { 
                        actorList.push(actor) }
                }
            }else{
                actorList = $gameParty.allMembers();
            }
            var re = /(\!?)\s*\=\s*(\d+)$/;
            var state = [];
            var swc = [];
            condition.match(/(?:switch|state|get)\s*\!?\s*\=\s*\d+/g).forEach(conds => {
                var num = conds.match(re);
                if (conds.includes("get")) {
                    getVariableID = num[2];
                } else {
                    var answer = num[2] * (num[1] ? -1 : 1);
                    conds.includes("state") ? state.push(answer) : swc.push(answer);
                }
            });
            $gameVariables.setValue(getVariableID, 0);
            actorList = actorList.filter(actor => {
                var condsState = true;
                for (var i = 0;condsState && i < state.length;i++) {
                    var id = state[i];
                    condsState = actor.isStateAffected(Math.abs(id));
                    if (id < 0) condsState = !condsState;
                }
                var condsSwc = true;
                for (var i = 0;condsSwc && i < swc.length;i++) {
                    var data = swc[i];
                    var id = actor.actorId() - 1 + Math.abs(data);
                    condsSwc = $gameSwitches.value(id);
                    if (data < 0) condsSwc = !condsSwc;
                }
                return condsState && condsSwc;
            });
            if (actorList.length) {
                actorList.forEach(actor => ImageManager.loadFace(actor.faceName()));
            }else{
                actorList.push(noOneChosen);
            }

            var cancelType = params[1];
            var defaultType = params.length > 2 ? params[2] : 0;
            var positionType = params.length > 3 ? params[3] : 2;
            var background = params.length > 4 ? params[4] : 0;
            if (cancelType >= choices.length) cancelType = -2;

            $gameMessage.setChoices(actorList, defaultType, cancelType);
            $gameMessage.setChoiceBackground(background);
            $gameMessage.setChoicePositionType(positionType);

            $gameMessage.setChoiceCallback(function(n) {
                if (n == -2) {
                    $gameVariables.setValue(getVariableID, 0);
                    this._branch[this._indent] = -2;
                }else{
                    if (typeof actorList[n] === "string") {
                        this._branch[this._indent] = 1;
                        $gameVariables.setValue(getVariableID, -1);
                    }else{
                        this._branch[this._indent] = 0;
                        $gameVariables.setValue(getVariableID, actorList[n].actorId());
                    }
                }
            }.bind(this));
        }else{
            setupChoices.apply(this, arguments);
        }
    };

    const createSubWindows = Window_Message.prototype.createSubWindows;
    Window_Message.prototype.createSubWindows = function() {
        createSubWindows.apply(this, arguments);
        this._actorDetailWindow = new Window_Base(0,0,Graphics.width, 192);
        this._actorDetailWindow.openness = 0;
        this._choiceWindow._actorDetailWindow = this._actorDetailWindow;
    };

    const kns_subWindows = Window_Message.prototype.subWindows;
    Window_Message.prototype.subWindows = function() {
        return kns_subWindows.apply(this, arguments).concat(this._actorDetailWindow);
    };

    const kns_start = Window_ChoiceList.prototype.start;
    Window_ChoiceList.prototype.start = function() {
        this.startActorDetail();
        kns_start.apply(this, arguments);
    };

    const kns_select = Window_ChoiceList.prototype.select;
    Window_ChoiceList.prototype.select = function(index) {
        kns_select.apply(this, arguments);
        this.refreshActorDetail();
    };

    const kns_close = Window_ChoiceList.prototype.close;
    Window_ChoiceList.prototype.close = function() {
        kns_close.apply(this, arguments);
        this._actorDetailWindow.close();
    };

    function testText(text) { return text && text.constructor == Game_Actor }
    function isCaMode() { return testText($gameMessage.choices()[0]) }
    function changeTextToName(text) {
        if (testText(text)) text = text.name();
        return text;
    }

    Window_ChoiceList.prototype.refreshActorDetail = function () {
        if (this._actorDetailWindow) {
            this._actorDetailWindow.contents.clear();
            if (isCaMode()) {
                var actor = $gameMessage.choices()[this.index()];
                if (testText(actor)) {
                    this._actorDetailWindow.drawActorFace(actor,0,0);
                    var x = 156;
                    this._actorDetailWindow.drawActorName(actor, x, 0);
                    this._actorDetailWindow.drawActorClass(actor, 368, 0);
                    this._actorDetailWindow.drawActorLevel(actor, x, 36);
                    var y = 72;
                    var w = 184;
                    this._actorDetailWindow.drawActorHp(actor, x, y, w);
                    this._actorDetailWindow.drawActorMp(actor, x, y + 36, w);
                    var i = 0;
                    w = 184;
                    [2, 5, 3, 6, 4, 7].forEach(id => {
                        var name = TextManager.param(id);
                        var value = actor.param(id);

                        var mr = i % 2;
                        var x = 368 + mr * w + 32 * mr, y = parseInt(i++ / 2) * 34 + 45;
                        this._actorDetailWindow.changeTextColor(this.systemColor());
                        this._actorDetailWindow.drawText(name,  x, y, w);
                        this._actorDetailWindow.changeTextColor(this.normalColor());
                        this._actorDetailWindow.drawText(value, x, y, w, 'right');
                    });

                }
            }
        }
    }

    Window_ChoiceList.prototype.startActorDetail = function() {
        if (isCaMode()) {
            this._actorDetailWindow.open();
            if ($gameMessage.positionType() == 0){
                this._actorDetailWindow.y = Graphics.height - this._actorDetailWindow.height;
            }else{
                this._actorDetailWindow.y = 0;
            }
        }
    };

    const numVisibleRows = Window_ChoiceList.prototype.numVisibleRows;
    Window_ChoiceList.prototype.numVisibleRows = function() {
        var choice = $gameMessage.choices();
        return isCaMode() ? Math.min(choice.length, 6) : numVisibleRows.apply(this, arguments);
    };

    const textWidthEx = Window_ChoiceList.prototype.textWidthEx;
    Window_ChoiceList.prototype.textWidthEx = function(text) {
        return textWidthEx.call(this, changeTextToName(text));
    };

    const commandName = Window_ChoiceList.prototype.commandName;
    Window_ChoiceList.prototype.commandName = function(index) {
        return changeTextToName(commandName.apply(this, arguments));
    };
})();