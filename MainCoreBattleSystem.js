/*
 * ===========================================================================
 * MainCoreBattleSystem.js
 * ---------------------------------------------------------------------------
 * version 1.00 demo
 * Copyright (c) 2020 Kanji the Grass
 * This work is provided under the MTCM Blue License
 * - https://en.materialcommons.tk/mtcm-b-summary/
 * Credits display: Kanji the Grass order by Munokura fungamemake.com
 * ===========================================================================
*/
/*:
 * @plugindesc コアとダウン、拘束状態を実装するプラグインです。
 * @author 莞爾の草
 *
 * @param coreString
 * @text コアの指定文言
 * @desc アクターのメモ欄にこの文言を書くとコアキャラクターに指定できます。他のプラグインと被らないものを。
 * @type string
 * @default ■コア■
 * 
 * @param downStateId
 * @text ダウン状態のステートID
 * @desc 自然数で指定してください
 * @type number
 * @default 5
 * 
 * @help
 * デフォルトではアクターのメモ欄に■コア■と書くことでコアのキャラに設定できます。
 * ダウン状態のステートIDは5です（パラメータで変更可能）。
 * 戦闘不能ステートは敵とコアのために取っておいてください。
 * 
 * ステートのメモ欄に
 * <拘束中>
 * と書くことでアクターを拘束中のステートに指定できます。
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
    var param = PluginManager.parameters('MainCoreBattleSystem');
    param.coreString     = String(param['coreString']  || "■コア■");
    param.downStateId    = Number(param['downStateId'] || 5);

    // コアを設定
    Game_Actor.prototype.isMainCharacter = function() {
        return !this.isCoreCharacter();
    };

    Game_Actor.prototype.isCoreCharacter = function() {
        return this.actor().note.includes(param.coreString);
    };

    const __kanji_canMove = Game_Actor.prototype.canMove;
    Game_Actor.prototype.canMove = function() {
        return this.isMainCharacter() && __kanji_canMove.call(this);
    };

    const __kanji_canInput = Game_Actor.prototype.canInput;
    Game_Actor.prototype.canInput = function() {
        return this.isMainCharacter() && __kanji_canInput.call(this);
    };

    // コアじゃないメンバーを取得
    Game_Party.prototype.knsMainMembers = function() {
        return this.battleMembers().filter(actor => actor.isMainCharacter());
    };

    // コアが倒されたらメインキャラも死亡
    const __kanji_die = Game_Actor.prototype.die;
    Game_Actor.prototype.die = function() {
        __kanji_die.call(this);
        if (this.isCoreCharacter()) {
            $gameParty.knsMainMembers().forEach(actor => {
                actor.addState(param.downStateId);
            });
        }
    };

    // ダウン中もステートを付加できるようにする
    Game_Actor.prototype.isStateAddable = function(stateId) {
        return ($dataStates[stateId] && !this.isStateResist(stateId) &&
                !this._result.isStateRemoved(stateId) && !this.isStateRestrict(stateId));
    };

    Game_Actor.prototype.boundState = function() {
        for (var state of this.states()) {
            if (state.note.includes("<拘束中>")) return true;
        }
        return false;
    }

    // 攻撃対象の設定。
    // 戦闘中、メインキャラが動ければメインキャラだけが対象に。動けなければコアも対象になる。
    const __kanji_aliveMembers = Game_Party.prototype.aliveMembers
    Game_Party.prototype.aliveMembers = function() {
        if (this.inBattle()) {
            if (this.knsMainMembers().every(actor => actor.isStateAffected(param.downStateId) || actor.boundState())) {
                return this.allMembers();
            } else {
                return this.knsMainMembers();
            }
        } else {
            return __kanji_aliveMembers.call(this)
        }
    };

    // 全滅判定
    const __kanji_isAllDead = Game_Party.prototype.isAllDead;
    Game_Party.prototype.isAllDead = function() {
        if (this.inBattle()) {
            var checkGameOver = this.battleMembers().every(actor => {
                return actor.isMainCharacter() || actor.isDead();
            });
            return checkGameOver;
        } else {
            return __kanji_isAllDead.call(this);
        }
    };

    const __kanji_deathStateId = Game_BattlerBase.prototype.deathStateId;
    Game_Actor.prototype.deathStateId = function() {
        return this.isMainCharacter() ? param.downStateId : __kanji_deathStateId.call(this);
    };
    
    
    Game_Actor.prototype.refresh = function() {
        Game_BattlerBase.prototype.refresh.call(this);
        if (this.hp === 0 && !this.isDead()) {
            this.addState(this.deathStateId());
        } else {
            if (this.isMainCharacter() && this.hp == this.mhp) {
                this.removeState(this.deathStateId());
            }
        }
    };
    
    const _kanji_isAlive = Game_Actor.prototype.isAlive;
    Game_Actor.prototype.isAlive = function() {
        return this.isMainCharacter() || _kanji_isAlive.call(this);
    };

    Game_Action.prototype.testApply = function(target) {
        return ((target.isActor() && target.isMainCharacter()) || 
                this.isForDeadFriend() === target.isDead()) &&
                ($gameParty.inBattle() || this.isForOpponent() ||
                (this.isHpRecover() && target.hp < target.mhp) ||
                (this.isMpRecover() && target.mp < target.mmp) ||
                (this.hasItemAnyValidEffects(target)));
    };
    
})();