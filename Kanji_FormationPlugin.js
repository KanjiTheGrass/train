//=============================================================================
// Kanji_FormationPlugin.js
//=============================================================================
 
/*:ja
 * @plugindesc 並び替え画面のレイアウトを変更します。
 * @author 莞爾の草
 * 
 * @param mainWindowX
 * @default 100
 * @desc メインキャラ選択ウィンドウのX座標
 *
 * @param mainWindowY
 * @default 200
 * @desc メインキャラ選択ウィンドウのY座標
 *
 * @param subWindowX
 * @default 100
 * @desc 控えキャラ選択ウィンドウのX座標
 *
 * @param subWindowY
 * @default ６５0
 * @desc 控えキャラ選択ウィンドウのY座標
 *
 * @param pictureOriginX
 * @default 1200
 * @desc キャラ立ち絵の表示X座標です。
 *
 * @param mainMemberDisplay
 * @default ■メインメンバー
 * @desc 並び替え画面で表示されるメインメンバーの名称です
 *
 * @param subMemberDisplay
 * @default ■控えメンバー
 * @desc 並び替え画面で表示される控えメンバーの名称です
 *
 * @param formationName
 * @default 並び替え
 * @desc 並び替え画面で表示される控えメンバーの名称です
 *
 * @help メンバー選択中に表示される画像はPictureフォルダ内に
 * classPicアクターのクラスID.png
 * という形式で作ってください。
 * 例：classPic1.png
 */
 
(function () {
    let parameters = PluginManager.parameters('Kanji_FormationPlugin');
    let mainWindowX = parseInt(parameters['mainWindowX'] || 100);
    let mainWindowY = parseInt(parameters['mainWindowY'] || 200);
    let subWindowX = parseInt(parameters['subWindowX'] || 100);
    let subWindowY = parseInt(parameters['subWindowY'] || 700);
    let pictureOriginX = parseInt(parameters['pictureOriginX'] || 0)
    let mainMemberDisplay = String(parameters['mainMemberDisplay'] || "■メインメンバー")
    let subMemberDisplay = String(parameters['subMemberDisplay'] || "■控えメンバー")
    let formationName = String(parameters['formationName'] || "並び替え")
 
    //=====================================================================
    // 汎用関数集。戦闘とメニュー上で処理を統一するため外部での関数として定義
    //=====================================================================
    const facePictureName = function (actor) { return "classPic" + actor._classId }

    const createMemberWindows = function (base) {
        $gameParty.allMembers().forEach(actor => {
            ImageManager.reserveFace(actor.faceName());
        });
        setPartyArray(base);
        base._moving = 0;
        base._mainWindow = new Window_MainActors(base._parties, mainWindowX, mainWindowY);
        base._mainWindow.setHandler('cancel', base.onFormationCancel.bind(base));
        base._mainWindow.select(0);
 
        base._subWindow = new Window_SubActors(base._parties, subWindowX, subWindowY);
        base._subWindow.setHandler('cancel', base.onFormationCancel.bind(base));

        base._mainWindow._oppositeWindow = base._subWindow;
        base._subWindow._oppositeWindow  = base._mainWindow;
 
        base.addWindow(base._mainWindow);
        base.addWindow(base._subWindow);

        base._statusWindowKanji = new Window_FormStatus(Graphics.boxWidth - 750, 400, 600, 395)
        base._equipWindowKanji = new Window_FormEquip(Graphics.boxWidth - 775, 805, 650, 240)
    }

    const setPartyArray = function (base) {
        base._parties = [new Array(5).fill(null), new Array(10).fill(null)];
        let actor, j = 0, k = 0;
        for (let i = 0;actor = $gameParty.allMembers()[k];i++){
            base._parties[j][i] = actor._actorId;
            if (k == $gameParty.maxBattleMembers_fix() - 1) { 
                j++;
                i = -1;
            };
            k++;
        }
        if (base._mainWindow) {
            base._mainWindow._parties = base._subWindow._parties = base._parties;
        }
    }

    const updateMemberWindows = function (base) {
        if (!base._mainWindow && !base._subWindow) return;
        if (!base._mainWindow.active && !base._subWindow.active) return;
        if (base._lastActorId !== getActorId(base)) {
            base._lastActorId = getActorId(base);
            let actor = $gameActors.actor(base._lastActorId);
            base._statusWindowKanji.refresh();
            base._equipWindowKanji.refresh();
            if (base._lastActorId != 0 && actor) {
                base.redrawPicture(actor)
                base._charaSprite.x = pictureOriginX;
                base._charaSprite.y = 0;
                base._charaSprite.opacity = 0;
                base._moving = 0;
            } else {
                base._moving = -1;
                base.clearDimmerBitmap()
            }
        } else {
            if (base._moving != -1) {
                base._moving += base._moving < 18 ? 2 : 1;
                if (base._moving == 30) {
                    base._moving = -1;
                } else {
                    base._charaSprite.x--;
                    base._charaSprite.opacity += 14;
                }
            }
        }
    }

    const getActorId = function (base) {
        let actWindow = base._mainWindow.active ? base._mainWindow : base._subWindow;
        let actor = actWindow.party(actWindow.index());
        return actor ? actor._actorId : 0;
    }

    const resetMainAndSub = function (base) {
        base._mainWindow._pendingIndex = -1;
        base._subWindow._pendingIndex = -1;
        base._mainWindow.refresh();
        base._subWindow.refresh();
    }

    //=====================================================================
    // Game_Party
    //=====================================================================
    Game_Party.prototype.maxBattleMembers = function () {
        return 5;
    }

    Game_Party.prototype.maxBattleMembers_fix = function () {
        this._partySize = this._partySize || 0;
        return this._partySize;
    }

    Game_Party.prototype.battleMembers = function() {
        return this.allMembers().slice(0, this.maxBattleMembers_fix()).filter(function(actor) {
            return actor.isAppeared();
        });
    };


    const _Game_Party_setupStartingMembers = Game_Party.prototype.setupStartingMembers;
    Game_Party.prototype.setupStartingMembers = function() {
        _Game_Party_setupStartingMembers.call(this);
        this._partySize = Math.min($dataSystem.partyMembers.length, 5);
    };

    const _Game_Party_addActor = Game_Party.prototype.addActor;
    Game_Party.prototype.addActor = function (actorId) {
        if (!this._actors.contains(actorId) && this.maxBattleMembers_fix() < 5) {
            this._partySize++;
        }
        _Game_Party_addActor.call(this, actorId);
    };
 
    const _Game_Party_removeActor = Game_Party.prototype.removeActor;
    Game_Party.prototype.removeActor = function (actorId) {
        if (this._actors.contains(actorId) && this.maxBattleMembers_fix() > 1) {
            this._partySize--;
        }
        _Game_Party_removeActor.call(this, actorId);
    };
 
    //=====================================================================
    // Window_FormStatus
    //=====================================================================
    function Window_FormStatus() {
        this.initialize.apply(this, arguments);
    }
 
    Window_FormStatus.prototype = Object.create(Window_Selectable.prototype);
    Window_FormStatus.prototype.constructor = Window_FormStatus;
 
    Window_FormStatus.prototype.drawItem = function (index) {
        let actor = getActorId(SceneManager._scene);
        let rect = this.itemRect(index);
        if (actor) {
            actor = $gameActors.actor(actor);
            switch (index) {
                case 0:
                    this.drawActorHp(actor, rect.x, rect.y, rect.width);
                    break;
                case 1:
                    this.drawActorMp(actor, rect.x, rect.y, rect.width);
                    break;
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    this.changeTextColor(this.systemColor())
                    this.drawText(TextManager.param(index), rect.x, rect.y, 120);
                    this.resetTextColor();
                    this.drawText(actor.param(index), rect.x, rect.y, rect.width, 'right');
                    break;
            }
        }
    }
 
    const _Window_Selectable_drawAllItems = Window_Selectable.prototype.drawAllItems;
    Window_FormStatus.prototype.drawAllItems = function () {
        this.contents.fontSize = 28;
        _Window_Selectable_drawAllItems.call(this);
        this.contents.fontSize = 34;
        let actor = getActorId(SceneManager._scene);
        if (actor) { this.drawActorName($gameActors.actor(actor), 0, 0,220) }
    };
 
    Window_FormStatus.prototype.maxItems = function () { return 8 };
 
    Window_FormStatus.prototype.itemRect = function (index) {
        let rect = Window_Selectable.prototype.itemRect.call(this, index);
        rect.y += 42;
        if (index > 1) { rect.y += 17 };
        return rect;
    }
 
 
 
    //=====================================================================
    // Window_FormEquip
    //=====================================================================
    function Window_FormEquip() {
        this.initialize.apply(this, arguments);
    }
 
    Window_FormEquip.prototype = Object.create(Window_Selectable.prototype);
    Window_FormEquip.prototype.constructor = Window_FormEquip;
 
    Window_FormEquip.prototype.initialize = function (x, y, w, h) {
        Window_Selectable.prototype.initialize.call(this, x, y, w, h);
        this.setBackgroundType(1);
    }
 
    Window_FormEquip.prototype.update = function () {
        Window_Selectable.prototype.update.call(this)
        if (this.opacity != 0) this.opacity = 0;
    }
 
    Window_FormEquip.prototype.drawItem = function (index) {
        let actor = getActorId(SceneManager._scene);
        let rect = this.itemRect(index);
        if (actor) {
            this.changeTextColor(this.systemColor());
            this.drawText(this.slotName(index), rect.x, rect.y, 138, this.lineHeight());
            let item = $gameActors.actor(actor).equips()[index];
            if (item) {
                this.resetTextColor();
                this.drawText(item.name, rect.x, rect.y, rect.width, 'right');
            }
        }
    }
 
    Window_FormEquip.prototype.slotName = function (index) {
        let actor = $gameActors.actor(getActorId(SceneManager._scene));
        var slots = actor.equipSlots();
        return actor ? $dataSystem.equipTypes[slots[index]] : '';
    };
 
    Window_FormEquip.prototype.maxItems = function () {
        return 5;
    }
 
    Window_FormEquip.prototype.dimColor1 = function () {
        return 'rgba(128, 128, 128, 0.6)';
    };
 
    Window_FormEquip.prototype.dimColor2 = function () {
        return 'rgba(128, 128, 128, 0)';
    };
 
 
 
    //=====================================================================
    // Window_MainActors
    //=====================================================================
    function Window_MainActors() {
        this.initialize.apply(this, arguments);
    }
 
    Window_MainActors.prototype = Object.create(Window_Selectable.prototype);
    Window_MainActors.prototype.constructor = Window_MainActors;
 
    Window_MainActors.prototype.initialize = function (parties, x, y) {
        Window_Selectable.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
        this._pendingIndex = -1;
        this._parties = parties
        this.refresh();
    }

    Window_MainActors.prototype.windowId = function () { return 0 }

    Window_MainActors.prototype.windowWidth = function () {
        return ((this.itemWidth() + this.spacing()) * this.maxCols()) + this.standardPadding() * 2;
    }
    Window_MainActors.prototype.windowHeight = function () {
        return (this.itemHeight() * this.numVisibleRows()) + this.standardPadding() * 2 + 
        this.categoryHeight();
    }

    Window_MainActors.prototype.numVisibleRows = function () { return 1 }
    Window_MainActors.prototype.maxItems = function () { return 5 }
    Window_MainActors.prototype.maxCols  = function () { return 5 }
    Window_MainActors.prototype.itemWidth  = function () { return 146 }
    Window_MainActors.prototype.itemHeight = function () { return 146 }
    Window_MainActors.prototype.categoryHeight = function () { return 36 }
    Window_MainActors.prototype.isOkEnabled = function (){return true}

    Window_MainActors.prototype.itemRect = function (index) {
        let rect = Window_Selectable.prototype.itemRect.call(this, index);
        rect.y += this.categoryHeight();
        return rect;
    }

    Window_MainActors.prototype.noPendingWindows = function () {
        return this._pendingIndex == -1 && this._oppositeWindow._pendingIndex == -1;
    }

    Window_MainActors.prototype.processOk = function () {
        SoundManager.playCursor();
        if (this.noPendingWindows()) {
            this._pendingIndex = this.index();
            this.redrawItem(this.index());
        } else {
            let lastWindow = this._pendingIndex == -1 ? this._oppositeWindow : this;
            let lastId = lastWindow.windowId()
            let lastIndex = lastWindow._pendingIndex;

            let curId  = this.windowId();
            let curIndex = this.index();

            let tmp = this._parties[lastId][lastIndex];
            this._parties[lastId][lastIndex] = this._parties[curId][curIndex];
            this._parties[curId][curIndex] = tmp;
            // 入れ替えた結果０だったらやり直し
            if (this._parties[0].filter(v => !!v).length == 0) {
                tmp = this._parties[curId][curIndex];
                this._parties[curId][curIndex] = this._parties[lastId][lastIndex];
                this._parties[lastId][lastIndex] = tmp;
            }
            resetMainAndSub(SceneManager._scene);
        }
    }

    const __kns_processCancel = Window_MainActors.prototype.processCancel;
    Window_MainActors.prototype.processCancel = function () {
        if (this.noPendingWindows()) {
            let a = this._parties[0].filter(v => !!v);
            $gameParty._partySize = a.length;
            $gameParty._actors = a.concat(this._parties[1].filter(v => !!v))
            $gamePlayer.refresh();
            __kns_processCancel.apply(this, arguments);
        }else{
            SoundManager.playCancel();
            resetMainAndSub(SceneManager._scene);
            this.activate();
        }
    }


    Window_MainActors.prototype.drawItem = function (index) {
        let rect = this.itemRect(index);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
        if (this._pendingIndex == index) {
            this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, '#ff000055');
        }
        let actor = this.party(index);
        if (actor) {
            this.drawActorFace(actor, rect.x + 1, rect.y + 1);
        } else {
            this.drawText("―", rect.x, rect.y + (rect.height - 36) / 2, rect.width, 'center');
        }
    }
 
    Window_MainActors.prototype.drawAllItems = function () {
        _Window_Selectable_drawAllItems.call(this);
        this.changeTextColor(this.systemColor());
        this.drawText(this.itemCategory(), 0, 0);
        this.resetTextColor();
    };
 
    Window_MainActors.prototype.party = function (index) {
        let id = this._parties[this.windowId()][index]
        return id ? $gameActors.actor(id) : null;
    }
 
    Window_MainActors.prototype.itemCategory = function () { 
        return mainMemberDisplay;
    };

    Window_MainActors.prototype.oppositeActivate = function (top) {
        if (!this._oppositeWindow) return false;
        var col = this.maxCols();
        if (this.numVisibleRows() == 2) {
            if (top  && this.index() >= col) return false;
            if (!top && this.index() <  col) return false;
            this._oppositeWindow.select(this.index() % 5);
        }else{
            this._oppositeWindow.select(top ? this.index() + col : this.index());
        }
        SoundManager.playCursor();
        this.deselect();
        this._oppositeWindow.activate();
        this.deactivate();
        Input.clear();
        return true;
    };

    const __superCursorUp = Window_MainActors.prototype.cursorUp;
    Window_MainActors.prototype.cursorUp = function () { 
        if (!this.oppositeActivate(true)) __superCursorUp.apply(this, arguments);
    };

    const __superCursorDown = Window_MainActors.prototype.cursorDown;
    Window_MainActors.prototype.cursorDown = function () { 
        if (!this.oppositeActivate(false)) __superCursorDown.apply(this, arguments);
    };

    //=====================================================================
    // Window_SubActors
    //=====================================================================
    function Window_SubActors() { this.initialize.apply(this, arguments) };
    Window_SubActors.prototype = Object.create(Window_MainActors.prototype);
    Window_SubActors.prototype.constructor = Window_SubActors;

    Window_SubActors.prototype.windowId = function () { return 1 }
    Window_SubActors.prototype.numVisibleRows = function () { return 2 }
    Window_SubActors.prototype.maxItems = function () { return 10 }
    Window_SubActors.prototype.itemCategory = function () { 
        return subMemberDisplay;
    };

    //=====================================================================
    // Scene_Party
    //=====================================================================
    const _Scene_Party_createBackground = Scene_Party.prototype.createBackground;
    Scene_Party.prototype.createBackground = function () {
        _Scene_Party_createBackground.call(this);
        this._charaSprite = new Sprite();
        this._lastActorId = 0
        this.addChild(this._charaSprite);
    };
 
    Scene_Party.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        createMemberWindows(this);
        this._mainWindow.activate();
        this.addWindow(this._statusWindowKanji);
        this.addWindow(this._equipWindowKanji);
    };
 
    Scene_Party.prototype.onFormationCancel = function () {
        SceneManager.pop();
    };
 
    Scene_Party.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        updateMemberWindows(this);
    };
 
    Scene_Party.prototype.redrawPicture = function (actor) {
        this._charaSprite.bitmap = ImageManager.loadPicture(facePictureName(actor));
    }
 
    Scene_Party.prototype.clearDimmerBitmap = function () {
        this._charaSprite.bitmap = null;
    }
 
 
    //=====================================================================
    // Scene_Battle
    //=====================================================================
    const _Scene_Battle_create = Scene_Battle.prototype.create;
    Scene_Battle.prototype.create = function () {
        _Scene_Battle_create.call(this);
        this._lastActorId = 0;
 
        this._Formating = false
        this._charaSprite = new Window_Base(-28, -32, Graphics.boxWidth + 56, Graphics.boxHeight + 56);
        this._dimmerSprite = new Sprite();
        this._charaSprite.addChildToBack(this._dimmerSprite);
 
        this.addWindow(this._charaSprite);
        createMemberWindows(this);
 
        this._statusWindowSprite = new Sprite(this._statusWindowKanji.contents);
        this._statusWindowSprite.x = this._statusWindowKanji.x
        this._statusWindowSprite.y = this._statusWindowKanji.y
        this._equipWindowSprite = new Sprite(this._equipWindowKanji.contents);
        this._equipWindowSprite.x = this._equipWindowKanji.x
        this._equipWindowSprite.y = this._equipWindowKanji.y
        this.addChild(this._statusWindowSprite);
        this.addChild(this._equipWindowSprite);
 
        this._mainWindow.openness = 0;
        this._subWindow.openness = 0;
        this._statusWindowKanji.openness = 0;
        this._equipWindowKanji.openness = 0;
        this._charaSprite.openness = 0;
    };
 
    Scene_Battle.prototype.onFormationCancel = function () {
        $gameParty.members().forEach(actor => {
            actor.makeActions();
        });
        this._mainWindow.close();
        this._subWindow.close();
        this._statusWindowKanji.close();
        this._equipWindowKanji.close();
        this._statusWindowSprite.visible = false
        this._equipWindowSprite.visible = this._statusWindowSprite.visible
        this._charaSprite.close();
        this._Formating = false;
        this.startPartyCommandSelection();
    };
 
    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        if (this._charaSprite.opacity != 0) {
            this._charaSprite.opacity = 0;
        }
        _Scene_Battle_update.call(this);
        updateMemberWindows(this)
    };
 
    Scene_Battle.prototype.redrawPicture = function (actor) {
        this._dimmerSprite.bitmap = ImageManager.loadPicture(facePictureName(actor));
    }
 
    Scene_Battle.prototype.clearDimmerBitmap = function () {
        this._dimmerSprite.bitmap = null;
    }
 
    const _Scene_Battle_createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
    Scene_Battle.prototype.createPartyCommandWindow = function () {
        _Scene_Battle_createPartyCommandWindow.call(this);
        this._partyCommandWindow.setHandler('formation', this.commandFormation.bind(this));
    };
 
    Scene_Battle.prototype.commandFormation = function () {
        this._mainWindow.open();
        this._subWindow.open();

        this._equipWindowKanji.open();
        this._charaSprite.open();
        this._statusWindowKanji.open();
        this._statusWindowSprite.visible = true
        this._equipWindowSprite.visible = this._statusWindowSprite.visible
        this._Formating = true;
        this._partyCommandWindow.close();
        this._mainWindow.activate();
        this._mainWindow.select(0);
        this._subWindow.deselect();
        setPartyArray(this);
        resetMainAndSub(this);
    }
 
    Scene_Battle.prototype.changeInputWindow = function () {
        if (BattleManager.isInputting()) {
            if (this._Formating) {
 
            } else if (BattleManager.actor()) {
                this.startActorCommandSelection();
            } else {
                this.startPartyCommandSelection();
            }
        } else {
            this.endCommandSelection();
        }
    };
 
    //=====================================================================
    // Window_PartyCommand
    //=====================================================================
    Window_PartyCommand.prototype.makeCommandList = function () {
        this.addCommand(TextManager.fight, 'fight');
        this.addCommand(formationName, 'formation', $gameParty.allMembers().length > 1);
        this.addCommand(TextManager.escape, 'escape', BattleManager.canEscape());
    };
 
    Window_PartyCommand.prototype.itemTextAlign = function () {
        return 'center';
    };
 
 
 
})();