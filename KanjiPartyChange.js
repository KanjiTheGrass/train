/*
 * ===========================================================================
 * KanjiPartyChange.js
 * ---------------------------------------------------------------------------
 * version 1.1.0
 * Copyright (c) 2020 Kanji the Grass
 * This work is provided under the MTCM Blue License
 * - https://ja.materialcommons.org/mtcm-b-summary/
 * Credits display: Kanji the Grass ordered by Munokura fungamemake.com
 * ===========================================================================
*/

/*:
 * @command start
 * 
 * 
 * @command add
 * 
 * @arg actors
 * @type actor[]
 * @default []
 * 
 * 
 * @command del
 * 
 * @arg actors
 * @type actor[]
 * @default []
 * 
 * 
 * @command lock
 * 
 * @arg actors
 * @type actor[]
 * @default []
 * 
 * 
 * @command unlock
 * 
 * @arg actors
 * @type actor[]
 * @default []
 * 
 * 
 * @command clear
 * 
 * 
 * @command changeMaxParty
 * 
 * @arg partySize
 * @type number
 * @default 1
 * 
 * 
 * 
 * @plugindesc Provides a scene for switching party actors between.
 * @author Kanji the Grass
 *
 * @param system
 * @text ---General---
 *
 * @param addThisIntoMenuCommand
 * @parent system
 * @text Show Menu Command
 * @desc Show the 'Party Change' command in the Menu?
 * @type boolean
 * @on Show
 * @off Hide
 * @default true
 *
 * @param partyChangeCommand
 * @parent system
 * @text Command Party Change Text
 * @desc This is the text for the menu command.
 * @type string
 * @default Party Change
 *
 * @param maxBattleMembers
 * @parent system
 * @text Max Battle Members
 * @desc Maximum amount of actors that can participate in battle. Leave this at 0 to not use this function.
 * @type number
 * @default 0
 *
 * @param maxAllParty
 * @parent system
 * @text Max Party Members
 * @desc Maximum amount of actors in party.
 * @type number
 * @min 1
 * @default 8
 *
 * @param lockIcon
 * @parent system
 * @text Locked Icon
 * @desc This sets what icon to be used when an actor is locked.
 * @type number
 * @default 195
 *
 * @param layoutCW
 * @text ---Command Window---
 *
 * @param CWpos
 * @parent layoutCW
 * @text Window Setting
 * @desc Window Setting.
 * format [x, y, width, height]
 * @type string[]
 * @default [0, 0, 270, 192]
 *
 * @param alignmentOfCommand
 * @parent layoutCW
 * @text Text Alignment
 * @desc The text alignment for the command window.
 * left / center / right
 * @type combo
 * @default center
 * @option left
 * @option center
 * @option right
 *
 * @param changeTerm
 * @parent layoutCW
 * @type string
 * @text Change Command
 * @desc How the 'Change' command appears on the command window.
 * Leave this blank to remove it.
 * @default Change
 *
 * @param removeTerm
 * @parent layoutCW
 * @type string
 * @text Remove Command
 * @desc How the 'Remove' command appears on the command window.
 * Leave this blank to remove it.
 * @default Remove
 *
 * @param revertTerm
 * @parent layoutCW
 * @type string
 * @text Revert Command
 * @desc How the 'Revert' command appears on the command window.
 * Leave this blank to remove it.
 * @default Revert
 *
 * @param finishTerm
 * @parent layoutCW
 * @type string
 * @text Finish Command
 * @desc How the 'Finish' command appears on the command window.
 * Leave this blank to remove it.
 * @default Finish
 *
 * @param layoutPW
 * @text ---Party Window---
 *
 * @param PWpos
 * @parent layoutPW
 * @text Window Setting
 * @desc Window Setting.
 * format [x, y, width, height]
 * @type string[]
 * @default [270, 0, w-270, 192]
 *
 * @param pwFaceType
 * @parent layoutPW
 * @text Show Actor
 * @desc Show the actor's type. walk / face / sideV / none
 * @type combo
 * @default walk
 * @option walk
 * @option face
 * @option sideV
 * @option none
 *
 * @param actorListColMax
 * @parent layoutPW
 * @text Window columns
 * @desc Number of columns displayed. Member slots that exceed this number are listed below. 3 to 6 is recommended.
 * @type number
 * @default 4
 *
 * @param emptyFrameTerm
 * @parent layoutPW
 * @text Empty Text
 * @desc What text to display in an empty party slot.
 * @type string
 * @default - Empty -
 *
 * @param layoutWW
 * @text ---Standby Actors Window---
 *
 * @param WWpos
 * @parent layoutWW
 * @text Window Setting
 * @desc Window Setting.
 * format [x, y, width, height]
 * @type string[]
 * @default [0, 192, 250, h - 192]
 *
 * @param wwFaceType
 * @parent layoutWW
 * @text Show Actor
 * @desc Show the actor's type. walk / face / sideV / none
 * @type combo
 * @default walk
 * @option walk
 * @option face
 * @option sideV
 * @option none
 *
 * @param wwRowHeight
 * @parent layoutWW
 * @text Line Height
 * @desc The height used for each line actors.
 * @type number
 * @default 36
 *
 * @param removeOnReserveTerm
 * @parent layoutWW
 * @text Remove Command
 * @desc How the 'Remove' command appears on the Standby window.
 * Leave this blank to remove it.
 * @type string
 * @default Remove
 *
 * @param layoutSW
 * @text ---Parameters Window---
 *
 * @param SWpos
 * @parent layoutSW
 * @text Window Setting
 * @desc Window Setting.
 * format [x, y, width, height]
 * @type string[]
 * @default [250, 192, w - 250, h - 192]
 *
 * @param hpPos
 * @parent layoutSW
 * @text HP Position
 * @desc HP Position. If you wish to hide it, set the width to 0.
 * format [x, y, width]
 * @type string[]
 * @default [150, 72, 200]
 *
 * @param mpPos
 * @parent layoutSW
 * @text MP Position
 * @desc MP Position. If you wish to hide it, set the width to 0.
 * format [x, y, width]
 * @type string[]
 * @default [150, 108, 200]
 *
 * @param tpPos
 * @parent layoutSW
 * @text TP Position
 * @desc TP Position. If you wish to hide it, set the width to 0.
 * format [x, y, width]
 * @type string[]
 * @default [360, 72, 144]
 *
 * @param swFaceType
 * @parent layoutSW
 * @text Show Actor
 * @desc Show the actor's type. walk / face / sideV / none
 * @type combo
 * @default face
 * @option walk
 * @option face
 * @option sideV
 * @option none
 *
 * @param facePos
 * @parent layoutSW
 * @text Sprite Position
 * @desc Sprite for displaying parameters.
 * format [x, y]
 * @type string[]
 * @default [0, 0]
 *
 * @param nameShow
 * @parent layoutSW
 * @text Actor Name
 * @desc Show the actor's name?
 * @type boolean
 * @on Show
 * @off Hide
 * @default true
 *
 * @param namePos
 * @parent layoutSW
 * @text Name Position
 * @desc Name for displaying parameters.
 * format [x, y, width]
 * @type string[]
 * @default [150, 0, 180]
 *
 * @param classShow
 * @parent layoutSW
 * @text Actor Class
 * @desc Show the actor's class?
 * @type boolean
 * @on Show
 * @off Hide
 * @default true
 *
 * @param classPos
 * @parent layoutSW
 * @text Class Position
 * @desc Class for displaying parameters.
 * format [x, y, width]
 * @type string[]
 * @default [330, 0, 180]
 *
 * @param levelShow
 * @parent layoutSW
 * @text Actor Level
 * @desc Show the actor's level?
 * @type boolean
 * @on Show
 * @off Hide
 * @default true
 *
 * @param levelPos
 * @parent layoutSW
 * @text Level Position
 * @desc Level for displaying parameters.
 * format [x, y, width]
 * @type string[]
 * @default [150, 36, 120]
 *
 * @param iconsPos
 * @parent layoutSW
 * @text State Position
 * @desc State Icon for displaying parameters. If you wish to hide it, set the width to 0.
 * format [x, y, width]
 * @type string[]
 * @default [330, 36, 180]
 *
 * @param horzLineYPos
 * @parent layoutSW
 * @text Show Horizontal Line
 * @desc Set the Y position to display the horizontal line.
 * format [Y1, Y2, ...]
 * @type string[]
 * @default [148]
 *
 * @param equipShow
 * @parent layoutSW
 * @text Show Equip
 * @desc Show the actor's equip item list?
 * @type boolean
 * @on Show
 * @off Hide
 * @default true
 *
 * @param equipPos
 * @parent layoutSW
 * @text Equips Position
 * @desc Equips for displaying parameters.
 * format [x, y, width]
 * @type string[]
 * @default [0, 158, 320]
 *
 * @param equipRowHeight
 * @parent layoutSW
 * @text Equips Line Height
 * @desc The height used for each line equips.
 * @type number
 * @default 36
 *
 * @param statusShow
 * @parent layoutSW
 * @text Show Actor Parameters
 * @desc Show the actor's Parameters?
 * @type boolean
 * @on Show
 * @off Hide
 * @default true
 *
 * @param statusPos
 * @parent layoutSW
 * @text Parameters Position
 * @desc Position for displaying parameters.
 * format [x, y, width]
 * @type string[]
 * @default [340, 158, 180]
 *
 * @param statusRowHeight
 * @parent layoutSW
 * @text Parameters Line Height
 * @desc The height used for each line parameters.
 * @type number
 * @default 36
 *
 * @param paramListSW
 * @parent layoutSW
 * @text List of Parameters
 * @desc [ver.1.04]Display nml.param when you set just a number. 
 * ADDparam's shown if input starting with X,or SPLparam with S.
 * @type string[]
 * @default ["2","3","4","5","X1","S1"]
 *
 * @param xParamNames
 * @parent layoutSW
 * @text Names Of Add. Params
 * @desc [ver.1.04]Names of Additional Params on Status Window.
 * Change them as necessary.
 * @type string[]
 * @default ["Hit Rate","Evade Rate","Critical","Crt.Evade","Mgc.Evade","Mgc.Reflect","CounterAtk.","HP Recovery","MP Recovery","TP Recovery"]
 *
 * @param sParamNames
 * @parent layoutSW
 * @text Names Of SPL. Params
 * @desc [ver.1.04]Names of Special Params on Status Window.
 * Change them as necessary.
 * @type string[]
 * @default ["Target Rate","Guard Effect","Recovery Effect","Pharmacology","MP CostRate","TP Charge","PHYS.Damage","MGC.Damage","FloorDamage","EXP Gain Rate"]
 *
 * @param parcentStr
 * @parent layoutSW
 * @text Rate Term of ADD or SPL params
 * @desc [ver.1.04]A term when displays Additional params or Special one.
 * @type string
 * @default ％
 *
 * @help
 * - Already at a party:
 *     "Party Actors"
 * - Scene called from this plugin:
 *     "Party Change Scene"
 * - Members that can be called only from the "Party Change Scene":
 *     "Standby Actors"
 *
 * An array of window positions and heights can be described by a formula.
 *   Graphics.boxWidth is abbreviated as w.
 *   boxHeight is abbreviated as h.
 *
 * Plugin Command:
 *   kanjiPC start
 *     Opens up the "Party Change Scene" from the field.
 *
 *   kanjiPC add 3
 *     Add ID3 actor to the "Standby actors".
 *     If actors are already "Party Actors" or "Standby Actors", do nothing.
 *
 *   kanjiPC del 4 5-10
 *     Remove actors ID 4 and 5 from the "Standby Actors".
 *     If actors are "Party Actors", do nothing.
 *
 *   kanjiPC lock 1 3-5
 *     Locks actors 1, 3, 4, and 5
 *
 *   kanjiPC unlock 1 3-5 6
 *     Unlocks actors 1, 3, 4, 5, and 6.
 *     *ex.1-100 : When specifying sequential numbers, be sure to make the
 *                 left number smaller than the right number.
 *
 *   kanjiPC clear
 *     Empty the waiting actors information.
 *
 *   kanjiPC changeMaxParty 9
 *     Changes max party size to 9.
 * 
 * * P.S. about after ver.1.04
 * Added new function to parameters of Status Window.
 * You can display parameters as well as Additional parameters
 * and Special parameters as you want.
 * If you set just a number, displays a normal parameter.
 * Or setting a number starting with X(like "X0"), 
 * displays the first of Additional parameter(Hit Rate in this case).
 * And set starting with S, displays a Special parameter.
 * If you set "null", The offset you set displays empty line.
 * 
 * ■ID lists
 * ● Normal parameters
 *  0: Max HP        |  1: Max MP        |  2: Attack Power
 *  3: Defense Power |  4: Magic Attack  |  5: Magic Defense
 *  6: Agility       |  7: Luckness      |
 * 
 * ● Additional parameters
 * X0: Hit Rate           | X1: Evasion Rate  | X2: Critical Rate
 * X3: Critical Evadsion  | X4: Magic Evasion | X5: Magic Reflection
 * X6: Counterattack Rate | X7: HP Regenerate | X8: MP Regenerate
 * X9: TP Regenerate      |                   |
 *
 * ● Special parameters
 * S0: Target Rate      | S1: x Guard Effect | S2: x Recover Effect
 * S3: Pharmacology     | S4: x MP Consume   | S5: x TP Charge
 * S6: x PhysicalDamage | S7: x MagicDamage  | S8: x Floor Damage(when walk on like a poisonous swamp)
 * S9: x Gaining EXP    |                    |
 * 
 * --- Terms of use ---
 * This work is provided under the MTCM Blue License
 * - https://en.materialcommons.org/mtcm-b-summary
 * Credits：Kanji the Grass (Order by Munokura fungamemake.com )
 *
 * Please use after confirming license contents.
 */

/*:ja
 * @command start
 * 
 * 
 * @command add
 * 
 * @arg actors
 * @type actor[]
 * @default []
 * 
 * 
 * @command del
 * 
 * @arg actors
 * @type actor[]
 * @default []
 * 
 * 
 * @command lock
 * 
 * @arg actors
 * @type actor[]
 * @default []
 * 
 * 
 * @command unlock
 * 
 * @arg actors
 * @type actor[]
 * @default []
 * 
 * 
 * @command clear
 * 
 * 
 * @command changeMaxParty
 * 
 * @arg partySize
 * @type number
 * @default 1
 * 
 * 
 * 
 * @plugindesc 待機メンバーと入れ替えるシーンを追加します
 * @author 莞爾の草
 *
 * @param system
 * @text システム部
 *
 * @param addThisIntoMenuCommand
 * @parent system
 * @text メニュー表示
 * @desc メニュー画面に待機メンバーとの入れ替えコマンドを表示
 * @type boolean
 * @on 表示
 * @off 非表示
 * @default true
 *
 * @param partyChangeCommand
 * @parent system
 * @text メニュー上の表示テキスト
 * @desc メニュー画面で待機メンバーとの入れ替えコマンドの表示テキスト
 * @type string
 * @default パーティ編成
 *
 * @param maxBattleMembers
 * @parent system
 * @text 戦闘メンバーの最大数
 * @desc 戦闘メンバーの最大数です。ここで指定しない場合は0
 * @type number
 * @default 0
 *
 * @param maxAllParty
 * @parent system
 * @text パーティ最大人数
 * @desc パーティの最大人数です。
 * 戦闘参加人数+戦闘控えメンバーの最大数を指定してください。
 * @type number
 * @min 1
 * @default 8
 *
 * @param lockIcon
 * @parent system
 * @text ロックのアイコンID
 * @desc パーティにロックされたキャラに表示するアイコン画像のID。表示しない場合は0
 * @type number
 * @default 195
 *
 * @param layoutCW
 * @text コマンドウィンドウ
 *
 * @param CWpos
 * @parent layoutCW
 * @text 横・縦・幅・高さ
 * @type string[]
 * @desc ウィンドウの横・縦・幅・高さを指定。
 * 書式 [X座標,Y座標,幅,高さ]
 * @default [0, 0, 270, 192]
 *
 * @param alignmentOfCommand
 * @parent layoutCW
 * @text テキストの行揃え
 * @desc コマンドウィンドウの行揃え
 * @type select
 * @default left
 * @option 左
 * @value left
 * @option 中
 * @value center
 * @option 右
 * @value right
 *
 * @param changeTerm
 * @parent layoutCW
 * @type string
 * @text 「交代」表示テキスト
 * @desc 「交代」表示テキストを指定。空にするとコマンドが消えます。
 * @default 交代
 *
 * @param removeTerm
 * @parent layoutCW
 * @type string
 * @text 「外す」表示テキスト
 * @desc 「外す」表示テキストを指定。空にするとコマンドが消えます。
 * @default 外す
 *
 * @param revertTerm
 * @parent layoutCW
 * @type string
 * @text 「元に戻す」表示テキスト
 * @desc 「元に戻す」表示テキストを指定。空にするとコマンドが消えます。
 * @default 元に戻す
 *
 * @param finishTerm
 * @parent layoutCW
 * @type string
 * @text 「完了」表示テキスト
 * @desc 「完了」表示テキストを指定。空にするとコマンドが消えます。
 * @default 完了
 *
 * @param layoutPW
 * @text パーティ選択ウィンドウ
 *
 * @param PWpos
 * @parent layoutPW
 * @text 横・縦・幅・高さ
 * @desc ウィンドウの横・縦・幅・高さを指定
 * 書式 [X座標,Y座標,幅,高さ]
 * @type string[]
 * @default [270, 0, w-270, 192]
 *
 * @param pwFaceType
 * @parent layoutPW
 * @text キャラ表示タイプ
 * @desc キャラの表示タイプです。歩行キャラ・顔画像・[SV]戦闘キャラから選べます。
 * @type select
 * @default walk
 * @option 歩行キャラ
 * @value walk
 * @option 顔画像
 * @value face
 * @option [SV]戦闘キャラ
 * @value sideV
 * @option 表示しない
 * @value none
 *
 * @param actorListColMax
 * @parent layoutPW
 * @text ウィンドウ列数
 * @desc 表示される列数です。この人数を超えるメンバー枠は下にスクロールします。 3から6推奨。
 * @type number
 * @default 4
 *
 * @param emptyFrameTerm
 * @parent layoutPW
 * @text 空欄表示テキスト
 * @desc 空欄に表示するテキスト
 * @type string
 * @default - 空き -
 *
 * @param layoutWW
 * @text 待機メンバーウィンドウ
 *
 * @param WWpos
 * @parent layoutWW
 * @text 横・縦・幅・高さ
 * @desc ウィンドウの横・縦・幅・高さです。
 * 書式 [X座標,Y座標,幅,高さ]
 * @type string[]
 * @default [0, 192, 250, h - 192]
 *
 * @param wwFaceType
 * @parent layoutWW
 * @text キャラ表示タイプ
 * @desc キャラの表示タイプです。歩行キャラ・顔画像・[SV]戦闘キャラから選べます。
 * @type select
 * @default walk
 * @option 歩行キャラ
 * @value walk
 * @option 顔画像
 * @value face
 * @option [SV]戦闘キャラ
 * @value sideV
 * @option 表示しない
 * @value none
 *
 * @param wwRowHeight
 * @parent layoutWW
 * @text 項目の高さ
 * @desc 選択項目の行の高さを指定します。
 * @type number
 * @default 36
 *
 * @param removeOnReserveTerm
 * @parent layoutWW
 * @text 「外す」表示テキスト
 * @desc 「外す」表示テキスト。空にするとコマンドが消えます。
 * @type string
 * @default 外す
 *
 * @param layoutSW
 * @text 能力値ウィンドウ
 *
 * @param SWpos
 * @parent layoutSW
 * @text 横・縦・幅・高さ
 * @desc ウィンドウの横・縦・幅・高さを指定
 * 書式 [X座標,Y座標,幅,高さ]
 * @type string[]
 * @default [250, 192, w - 250, h - 192]
 *
 * @param hpPos
 * @parent layoutSW
 * @text HP表示位置・横幅
 * @desc HP表示位置と横幅。非表示にするには横幅を0に
 * 書式 [X座標,Y座標,幅]
 * @type string[]
 * @default [150, 72, 200]
 *
 * @param mpPos
 * @parent layoutSW
 * @text MP表示位置・横幅
 * @desc MP表示位置と横幅。非表示にするには横幅を0に
 * 書式 [X座標,Y座標,幅]
 * @type string[]
 * @default [150, 108, 200]
 *
 * @param tpPos
 * @parent layoutSW
 * @text TP表示位置・横幅
 * @desc TP表示位置と横幅。非表示にするには横幅を0に
 * 書式 [X座標,Y座標,幅]
 * @type string[]
 * @default [360, 72, 144]
 *
 * @param swFaceType
 * @parent layoutSW
 * @text キャラの表示タイプ
 * @desc キャラの表示タイプです。歩行キャラ・顔画像・[SV]戦闘キャラから選べます。
 * @type select
 * @default face
 * @option 歩行キャラ
 * @value walk
 * @option 顔画像
 * @value face
 * @option [SV]戦闘キャラ
 * @value sideV
 * @option 表示しない
 * @value none
 *
 * @param facePos
 * @parent layoutSW
 * @text キャラ表示位置
 * @desc キャラを表示する位置
 * 書式 [X座標,Y座標]
 * @type string[]
 * @default [0, 0]
 *
 * @param nameShow
 * @parent layoutSW
 * @text 名前表示
 * @desc 名前を表示するか指定
 * @type boolean
 * @on 表示
 * @off 非表示
 * @default true
 *
 * @param namePos
 * @parent layoutSW
 * @text 名前表示位置
 * @desc 名前を表示する位置
 * 書式 [X座標,Y座標,幅]
 * @type string[]
 * @default [150, 0, 180]
 *
 * @param classShow
 * @parent layoutSW
 * @text 職業表示
 * @desc 職業を表示するか指定
 * @type boolean
 * @on 表示
 * @off 非表示
 * @default true
 *
 * @param classPos
 * @parent layoutSW
 * @text 職業表示位置
 * @desc 職業を表示する位置
 * 書式 [X座標,Y座標,幅]
 * @type string[]
 * @default [330, 0, 180]
 *
 * @param levelShow
 * @parent layoutSW
 * @text レベル表示
 * @desc レベルを表示するか指定
 * @type boolean
 * @on 表示
 * @off 非表示
 * @default true
 *
 * @param levelPos
 * @parent layoutSW
 * @text レベル表示位置
 * @desc レベルを表示する位置
 * 書式 [X座標,Y座標, 幅]
 * @type string[]
 * @default [150, 36, 120]
 *
 * @param iconsPos
 * @parent layoutSW
 * @text ステート表示位置
 * @desc ステートアイコンを表示する位置と幅。非表示は横幅を0に
 * 書式 [X座標,Y座標,横幅]
 * @type string[]
 * @default [330, 36, 180]
 *
 * @param horzLineYPos
 * @parent layoutSW
 * @text 水平線表示Y座標
 * @desc 表示する水平線の縦位置(Y)。複数指定可能
 * 書式 [Y1, Y2, ...]
 * @type string[]
 * @default [148]
 *
 * @param equipShow
 * @parent layoutSW
 * @text 装備表示
 * @desc 装備を表示するか指定
 * @type boolean
 * @on 表示
 * @off 非表示
 * @default true
 *
 * @param equipPos
 * @parent layoutSW
 * @text 装備表示位置
 * @desc 装備を表示する位置
 * 書式 [X座標,Y座標,幅]
 * @type string[]
 * @default [0, 158, 320]
 *
 * @param equipRowHeight
 * @parent layoutSW
 * @text 装備表示の行高
 * @desc 装備を表示する行の高さを指定
 * @type number
 * @default 36
 *
 * @param statusShow
 * @parent layoutSW
 * @text 能力値表示
 * @desc 能力値を表示するか指定
 * @type boolean
 * @on 表示
 * @off 非表示
 * @default true
 *
 * @param statusPos
 * @parent layoutSW
 * @text 能力値表示位置
 * @desc 能力値を表示する位置
 * 書式 [X座標,Y座標,幅]
 * @type string[]
 * @default [340, 158, 180]
 *
 * @param statusRowHeight
 * @parent layoutSW
 * @text 能力値行高
 * @desc 能力値を表示する行の高さを指定
 * @type number
 * @default 36
 *
 * @param paramListSW
 * @parent layoutSW
 * @text 能力値表示項目
 * @desc [ver.1.04]表示する能力値一覧を変更できます。数字のみは
 * 通常(0:HP 2:攻撃等)、数字の前にXをつけると追加、Sで特殊能力値です。
 * @type string[]
 * @default ["2","3","4","5","X1","S1"]
 *
 * @param xParamNames
 * @parent layoutSW
 * @text 追加能力値名
 * @desc [ver.1.04]追加能力値の名称を設定します。
 * 必要に応じて。
 * @type string[]
 * @default ["命中率","回避率","会心率","会心回避率","魔法回避率","魔法反射率","反撃率","HP再生率","MP再生率","TP再生率"]
 *
 * @param sParamNames
 * @parent layoutSW
 * @text 特殊能力値名
 * @desc [ver.1.04]特殊能力値の名称を設定します。
 * 必要に応じて。
 * @type string[]
 * @default ["狙われ率","防御効果率","回復効果率","薬の知識","MP消費率","TPチャージ率","物理ダメージ率","魔法ダメージ率","床ダメージ率","経験獲得率"]
 *
 * @param parcentStr
 * @parent layoutSW
 * @text 追加・特殊能力値割合表示
 * @desc [ver.1.04]追加・特殊能力値の割合を表示する際、末尾につける％のテキストです。
 * 一応変更可能にしました。
 * @type string
 * @default ％
 *
 * @help
 * このプラグインでは
 * - 既にパーティにいるメンバー : 『パーティメンバー』
 * - このプラグインから呼び出す場面 : 『パーティ編成画面』
 * - 『パーティ編成画面』からのみで呼び出せるメンバー : 『待機メンバー』
 * と呼称しています。
 *
 * ウィンドウの位置、高さの配列は計算式で記述できます。
 * Graphics.boxWidth(画面幅)はw、boxHeightはhと省略できます。
 *
 * ■プラグインコマンド
 *   kanjiPC start
 *     パーティ編成画面を開く。
 *
 *   kanjiPC add 3
 *     待機メンバーにID3番のアクターを加える。
 *     既にパーティや待機メンバーにいる場合は何もしません。
 *
 *   kanjiPC del 4 5-10
 *     待機メンバーからID4と5から10番のアクターを外します。
 *     パーティにいる場合、何もしません。
 *     パーティにいるアクターを待機メンバーから外すには、
 *     事前に「メンバーの入れ替え」等でパーティから外してください。
 *
 *   kanjiPC lock 1 3-4
 *     ID1、3から4番のアクターをパーティから外せないようにします。
 *
 *   kanjiPC unlock 1 3-4 5
 *     ID1、3から4、5番のアクターにかかったロックを解除します。
 *     ※1-100のように連番で指定する場合、
 *       左の数字は右の数字より必ず小さくしてください。
 *
 *   kanjiPC clear
 *     待機メンバー情報を初期化(空に)します。
 *
 *   kanjiPC changeMaxParty 9
 *     パーティメンバーの最大数を9に変更します。
 * 
 * 【追記　ver.1.04以降】
 * ステータスウィンドウに通常能力値だけでなく、追加能力値（命中率など）、
 * 特別能力値（狙われ率など）を表示できるようになりました。
 * パラメータ「paramListSW」に数字だけを設定すると通常能力値（最大HPなど）
 * が表示されます。
 * 
 * 「X0」のように、Xの後に数字を設定すると、追加能力値の１番目（この場合命中率）
 * が表示されます。
 * 
 * 「S0」のようにSから始まる場合は特別能力値（この場合狙われ率）が表示されます。
 * また、数字を指定せず「null」とだけ設定するとその行は空白にすることができます。
 * 
 * ■通常能力値一覧表
 *  0: 最大ＨＰ　　　 |  1: 最大ＭＰ　　　 |  2: 攻撃力
 *  3: 防御力　　　　 |  4: 魔法攻撃力　　 |  5: 魔法防御力
 *  6: 俊敏性 　　　　|  7: 運　　　　　　 |
 * 
 * ■追加能力値一覧表
 * X0: 命中率 　　　　| X1: 回避率　　　　 | X2: 会心率
 * X3: 会心回避率　　 | X4: 魔法回避率　　 | X5: 魔法反射率
 * X6: 反撃率 　　　　| X7: ＨＰ再生率　　 | X8: ＭＰ再生率
 * X9: ＴＰ再生率　　 |     　　　　　　　 |
 *
 * ■特別能力値一覧表
 * S0: 狙われ率　　　 | S1: 防御効果率　　 | S2: 回復効果率
 * S3: 薬の知識　　　 | S4: MP消費率　　　 | S5: TPチャージ率
 * S6: 物理ダメージ率 | S7: 魔法ダメージ率 | S8: 床ダメージ率
 * S9: 経験獲得率　　 |     　　　　　　　 |
 * 
 * ■更新履歴
 * ver.1.01(2020/02/16)
 * ・英語版のパラメータの文言を変更しました
 * ver.1.02(2020/03/10)
 * ・パラメータの文言・デフォルト設定を一部変更
 * ver.1.03(2020/04/12)
 * ・statusPosの幅が設定できなかった不具合を修正しました
 * ver.1.04(2020/08/18)
 * ・ステータスウィンドウに表示する項目を変更できるようにしました。
 * （追加・特殊能力値にも対応）
 * ver.1.05(2023/09/13)
 * ・スロットの表示を修正
 * 
 * ■利用規約
 * この作品は マテリアル・コモンズ・ブルー・ライセンスの下に提供されています。
 * - https://ja.materialcommons.org/mtcm-b-summary/
 * クレジット表示：莞爾の草 (仕様作成:ムノクラ fungamemake.com )
 *
 * ライセンス内容を確認の上、ご利用ください。
 */
const KanjiPartyChange = {
    exports: {},
    _commands: {},
    registerCommand(name, args) {
        if (Utils.RPGMAKER_NAME === 'MZ') {
            PluginManager.registerCommand('KanjiPartyChange', name, args => {
                this.executeCommand(name, args);
            });
        }
        this._commands[name] = args;
    },
    executeCommand(command, args) {
        if (Utils.RPGMAKER_NAME === 'MZ') {
            args = [command].concat(args);
        }else{
            command = args[0];
        }
        if (this._commands[command]) {
            this._commands[command].call(this, args);
        } else {
            throw new Error(`[KanjiPartyChange] invalid command(${args})`);
        }
    },
    faceWidth(){ return Utils.RPGMAKER_NAME === 'MZ' ? ImageManager.faceWidth : Window_Base._faceWidth; },
    faceHeight(){ return Utils.RPGMAKER_NAME === 'MZ' ? ImageManager.faceHeight : Window_Base._faceHeight; },
};

(function () {
    "use strict";

    var param = PluginManager.parameters('KanjiPartyChange');

    param.alignmentOfCommand     = String(param['alignmentOfCommand']  || "center"),
    param.removeOnReserveTerm    = String(param['removeOnReserveTerm']),
    param.actorListColMax        = Number(param['actorListColMax']  || 4),
    param.maxBattleMembers       = Number(param['maxBattleMembers'] || 0)
    param.addThisIntoMenuCommand = eval(param['addThisIntoMenuCommand'] || false),
    param.partyChangeCommand     = String(param['partyChangeCommand'] || "パーティ編成"),
    param.cwPos = param['CWpos'] || "[0, 0, 250, 192]",
    param.pwPos = param['PWpos'] || "[250, 0, w - 250, 192]",
    param.wwPos = param['WWpos'] || "[0, 192, 250, h - 192]",
    param.swPos = param['SWpos'] || "[250, 192, w - 250, h - 192]",
    param.lockIcon    = Number(param['lockIcon']       || 195),
    param.changeTerm  = String(param['changeTerm']),
    param.removeTerm  = String(param['removeTerm']),
    param.revertTerm  = String(param['revertTerm']),
    param.finishTerm  = String(param['finishTerm']),
    param.emptyFrame  = String(param['emptyFrameTerm'] || "- EMPTY -"),
    param.swFaceType  = String(param['swFaceType']     || "face"),
    param.pwFaceType  = String(param['pwFaceType']     || "walk"),
    param.wwFaceType  = String(param['wwFaceType']     || "walk"),
    param.equipShow   = eval(param['equipShow']),
    param.levelShow   = eval(param['levelShow']),
    param.statusShow  = eval(param['statusShow']),
    param.nameShow    = eval(param['nameShow']),
    param.classShow   = eval(param['classShow']),
    param.levelPos    = param['levelPos']  || "[150, 36, 120]",
    param.equipPos    = param['equipPos']  || "[0, 158, 320]",
    param.statusPos   = param['statusPos'] || "[340, 158, 180]",
    param.facePos     = param['facePos']   || "[0, 0]",
    param.namePos     = param['namePos']   || "[150, 0, 180]",
    param.classPos    = param['classPos']  || "[330, 0, 180]",
    param.iconsPos    = param['iconsPos']  || "[330, 36, 180]",
    param.hpPos       = param['hpPos']     || "[150, 72, 200]",
    param.mpPos       = param['mpPos']     || "[150, 108, 200]",
    param.tpPos       = param['tpPos']     || "[360, 72, 144]",
    param.horzLineYPos= param['horzLineYPos']           || "[148]",
    param.wwRowHeight = Number(param['wwRowHeight']     || 48),
    param.equipRow    = Number(param['equipRowHeight']  || 36),
    param.statusRow   = Number(param['statusRowHeight'] || 36),
    param.maxAllParty = Number(param['maxAllParty']     || 8);

    // ver.1.04 ここから
    param.paramListSW = eval(param['paramListSW'] || ["2","3","4","5","X1","S1"]),
    param.xParamNames = eval(param['xParamNames'] || 
        ["命中率","回避率","会心率","会心回避率","魔法回避率","魔法反射率",
        "反撃率","HP再生率","MP再生率","TP再生率"]),
    param.sParamNames = eval(param['sParamNames'] || 
        ["狙われ率","防御効果率","回復効果率","薬の知識","MP消費率",
        "TPチャージ率","物理ダメージ率","魔法ダメージ率","床ダメージ率","経験獲得率"]);
    param.parcentStr = String(param.parcentStr || "％");
    // ver.1.04 ここまで


    //=================================================
    // KanjiPartyChange
    //=================================================
    this._parseIdList = function(data) {
        if (Utils.RPGMAKER_NAME === 'MZ') {
            return JsonEx.parse(data.actors).map(n => Number(n));
        }
        let list = data.match(/(\d+)(?:-(\d+))?/);
        if (list[2]) {
            var min = Number(list[1]), max = Number(list[2]);
            list = new Array(max - min + 1);
            for (var i = 0; i < list.length; i++) list[i] = i + min;
        }else{
            list = [Number(list[1])];
        }
        return list;
    }

    this._setLock = function(args, isLock) {
        for (var i = 1; args[i]; i++) {
            var m = this._parseIdList(args[i]);
            for (var j = 0; m[j]; j++) $gameActors.actor(m[j]).setKanjiPCLock(isLock);
        }
    }

    this.registerCommand('start', function() {
        SceneManager.push(Scene_KanjiPartyChange);
    });

    this.registerCommand('add', function(args) {
        var data, array = $gameSystem.waitingMembers();
        for (var i = 1; args[i]; i++) {
            var m = this._parseIdList(args[i])
            for (var j = 0; data = m[j]; j++) {
                if (!array.includes(data) && !$gameParty._actors.includes(data)) {
                    array.push(data);
                }
            }
        }
    });

    this.registerCommand('del', function(args) {
        if (!$gameSystem._waitingMembers) $gameSystem._waitingMembers = [];
        for (var i = 1; args[i]; i++) {
            var data, m = this._parseIdList(args[i])
            for (var j = 0; data = m[j]; j++) {
                $gameSystem._waitingMembers = 
                $gameSystem._waitingMembers.filter(id => { return id !== data });
            }
        }
    });

    this.registerCommand('lock', function(args) {
        this._setLock(args, true);
    });

    this.registerCommand('unlock', function(args) {
        this._setLock(args, false);
    });

    this.registerCommand('clear', function() {
        $gameSystem.waitingMembers().length = 0;
    });

    this.registerCommand('changeMaxParty', function(args) {
        let num;
        if (Utils.RPGMAKER_NAME === 'MZ') {
            num = Number(args[1].partySize);
        } else {
            num = Number(args[1]);
        }
        $gameSystem._kanjiPCMaxParty = num;
    });

    //=================================================
    // Game_Interpreter
    //=================================================
    const __pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        __pluginCommand.call(this, command, args);
        if (command === 'kanjiPC') { KanjiPartyChange.executeCommand(command, args) }
    };

    //=================================================
    // Game_Party
    //=================================================
    const __maxBattleMembers_Game_Party = Game_Party.prototype.maxBattleMembers;
    Game_Party.prototype.maxBattleMembers = function() {
        return param.maxBattleMembers ? param.maxBattleMembers :
        __maxBattleMembers_Game_Party.call(this);
    };

    //=================================================
    // Game_Actor
    //=================================================
    Game_Actor.prototype.kanjiPCLock = function () {
        return this._kanjiPCLock;
    }

    Game_Actor.prototype.setKanjiPCLock = function (lock) {
        this._kanjiPCLock = lock;
    }

    //=================================================
    // Game_System
    //=================================================
    Game_System.prototype.waitingMembers = function () {
        if (!this._waitingMembers) this._waitingMembers = []
        return this._waitingMembers;
    }

    //=================================================
    // Window_MenuCommand
    //=================================================
    const _Window_MenuCommand_addMainCommands = Window_MenuCommand.prototype.addMainCommands;
    Window_MenuCommand.prototype.addMainCommands = function() {
        _Window_MenuCommand_addMainCommands.call(this);
        if (param.addThisIntoMenuCommand) this.addCommand(param.partyChangeCommand, 'partyChange');
    };

    //=================================================
    // Scene_Menu
    //=================================================
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow
    Scene_Menu.prototype.createCommandWindow = function () {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('partyChange', this.commandKNSPartyChange.bind(this));
    }

    Scene_Menu.prototype.commandKNSPartyChange = function () {
        SceneManager.push(Scene_KanjiPartyChange);
    }

    //=================================================
    // Window_PCMainCommand
    //=================================================
    function Window_PCMainCommand (){
        return this.initialize.apply(this, arguments);
    }

    Window_PCMainCommand.prototype = Object.create(Window_Command.prototype);
    Window_PCMainCommand.prototype.constructor = Window_PCMainCommand;

    if (Utils.RPGMAKER_NAME === 'MV') {
        Window_PCMainCommand.prototype.initialize = function (x, y, w, h) {
            this.__windowWidth = w, this.__windowHeight = h;
            Window_Command.prototype.initialize.call(this, x, y);
        }

        Window_PCMainCommand.prototype.windowWidth = function () {
            return this.__windowWidth;
        }

        Window_PCMainCommand.prototype.windowHeight = function () {
            return this.__windowHeight;
        }
    }

    Window_PCMainCommand.prototype.makeCommandList = function (x, y) {
        if (param.changeTerm) this.addCommand(param.changeTerm, "change");
        if (param.removeTerm) this.addCommand(param.removeTerm, "remove");
        if (param.revertTerm) this.addCommand(param.revertTerm, "revert");
        if (param.finishTerm) this.addCommand(param.finishTerm, "cancel");
    }

    Window_PCMainCommand.prototype.itemTextAlign = function() {
        return param.alignmentOfCommand;
    };

    //=================================================
    // Window_PCActorList
    //=================================================
    function Window_PCActorList (){
        return this.initialize.apply(this, arguments);
    }

    Window_PCActorList.prototype = Object.create(Window_Selectable.prototype);
    Window_PCActorList.prototype.constructor = Window_PCActorList;

    Window_PCActorList.prototype.maxCols = function() {
        return param.actorListColMax;
    };

    Window_PCActorList.prototype.itemHeight = function() {
        return Utils.RPGMAKER_NAME === 'MZ' ? this.innerHeight : this.contentsHeight();
    };

    Window_PCActorList.prototype.maxItems = function() {
        return $gameSystem._kanjiPCMaxParty || param.maxAllParty;
    };

    Window_PCActorList.prototype.standardFontSize = function() {
        return 22;
    };

    Window_PCActorList.prototype.drawItem = function (index) {
        var actor = $gameActors.actor($gameParty._actors[index]), rect = this.itemRect(index);
        if (actor) {
            if (param.pwFaceType !== "none") {
                switch (param.pwFaceType) {
                    case "walk":
                        this.drawActorCharacter(actor, rect.x + rect.width / 2,
                            rect.y + rect.height - 30);
                        break;
                    case "face":
                        this.drawActorFace(actor, rect.x, rect.y, rect.width, rect.height);
                        break;
                    case "sideV":
                        var bitmap = ImageManager.loadSvActor(actor.battlerName());
                        var ww = bitmap.width / 9, hh = bitmap.height / 6
                        this.contents.blt(bitmap, 0, 0, ww, hh, rect.x + (rect.width - ww) / 2,
                            rect.y + (rect.height - hh) / 2);
                        break;
                }
            }
            this.drawText(actor.name(), rect.x,
            rect.y + rect.height - this.standardFontSize() - 14, rect.width, "center")
            if (actor.kanjiPCLock()) this.drawIcon(param.lockIcon, rect.x, rect.y)
        } else {
            this.contents.paintOpacity = 128;
            this.drawText(param.emptyFrame, rect.x, rect.y + (this.itemHeight() - this.standardFontSize()) / 2,
            rect.width, "center")
            this.contents.paintOpacity = 255;
        }
    }

    Window_PCActorList.prototype.updateHelp = function () {
        const actor = $gameActors.actor($gameParty._actors[this._index]);
        this._helpWindow.refreshStatus(actor);
    }

    //=================================================
    // Window_ReserveMember
    //=================================================
    function Window_ReserveMember () {
        this.initialize.apply(this, arguments);
    }

    Window_ReserveMember.prototype = Object.create(Window_Selectable.prototype);
    Window_ReserveMember.prototype.constructor = Window_ReserveMember;

    Window_ReserveMember.prototype.maxItems = function() {
        return $gameSystem.waitingMembers().length + (param.removeOnReserveTerm ? 1 : 0);
    };

    Window_ReserveMember.prototype.drawItem = function (index) {
        const rect = this.itemRect(index);
        if (!param.removeOnReserveTerm || index > 0) {
            var actor = $gameActors.actor($gameSystem.waitingMembers()[index-
                (param.removeOnReserveTerm ? 1 : 0)]);
            if (param.wwFaceType !== "none") {
                switch (param.wwFaceType) {
                    case "walk":
                        this.drawActorCharacter(actor, rect.x + 20, rect.y,rect.width, rect.height);
                        this.drawText(actor.name(), rect.x+42, rect.y,rect.width);
                        break;
                    case "face":
                        this.drawActorFace(actor, rect.x + rect.width - KanjiPartyChange.faceWidth(),
                            rect.y, KanjiPartyChange.faceWidth(), rect.height);
                        this.drawText(actor.name(), rect.x, rect.y,rect.width);
                        break;
                    case "sideV":
                        var bitmap = ImageManager.loadSvActor(actor.battlerName());
                        var ww = bitmap.width / 9, hh = bitmap.height / 6
                        this.contents.blt(bitmap, 0, 0, ww, Math.min(hh, rect.height), rect.x-10, rect.y);
                        this.drawText(actor.name(), rect.x+42, rect.y,rect.width);
                        break;
                }
            }
        }else{
            this.drawText(param.removeOnReserveTerm, rect.x, rect.y,rect.width, "center");
        }
    }

    Window_ReserveMember.prototype.drawCharacter = function(characterName, characterIndex, x, y) {
        var bitmap = ImageManager.loadCharacter(characterName);
        var big = ImageManager.isBigCharacter(characterName);
        var pw = bitmap.width / (big ? 3 : 12);
        var ph = bitmap.height / (big ? 4 : 8);
        var n = characterIndex;
        var sx = (n % 4 * 3 + 1) * pw;
        var sy = (Math.floor(n / 4) * 4) * ph;
        this.contents.blt(bitmap, sx, sy, pw, this.itemHeight(), x - pw / 2, y);
    };

    Window_ReserveMember.prototype.lineHeight = function () {
        return param.wwRowHeight;
    }

    Window_ReserveMember.prototype.updateHelp = function () {
        const actor = !param.removeOnReserveTerm || this._index ?
        $gameActors.actor($gameSystem.waitingMembers()[this._index - 
            (param.removeOnReserveTerm ? 1 : 0)]) : null;
        this._helpWindow.refreshStatus(actor);
    }


    //=================================================
    // Window_ActorInfo
    //=================================================
    function Window_ActorInfo () {
        this.initialize.apply(this, arguments);
    }

    Window_ActorInfo.prototype = Object.create(
        (Utils.RPGMAKER_NAME === 'MZ' ? Window_StatusBase : Window_Selectable).prototype
    );
    Window_ActorInfo.prototype.constructor = Window_ActorInfo;


    Window_ActorInfo.prototype.parseRectangle = function(pos) {
        var w = Graphics.boxWidth, h = Graphics.boxHeight;
        return eval(pos);
    }

    Window_ActorInfo.prototype.refreshStatus = function(actor) {
        if (Utils.RPGMAKER_NAME === 'MZ') {
            this.refresh();
        } else {
            this.contents.clear();
        }
        if (!actor) {
            return;
        }
        let a, x, y;

        this.contents.fontSize = 26;
        if (param.swFaceType !== "none") {
            const a = this.parseRectangle(param.facePos);
            switch (param.swFaceType) {
                case "walk":
                    this.drawActorCharacter(actor, a[0] + KanjiPartyChange.faceWidth() / 2, a[1] + KanjiPartyChange.faceHeight() - 8);
                    break;
                case "face":
                    this.drawActorFace(actor, a[0], a[1], KanjiPartyChange.faceWidth(), KanjiPartyChange.faceHeight());
                    break;
                case "sideV":
                    var bitmap = ImageManager.loadSvActor(actor.battlerName());
                    var ww = bitmap.width / 9, hh = bitmap.height / 6
                    this.contents.blt(bitmap, 0, 0, ww, hh,
                        a[0] + (KanjiPartyChange.faceWidth() - ww) / 2, a[1] + (KanjiPartyChange.faceHeight() - hh) / 2);
                    break;
            }
        }
        if (param.nameShow) {
            const a = this.parseRectangle(param.namePos);
            this.drawActorName(actor, a[0], a[1], a[2] || 180);
        }
        if (param.classShow) {
            const a = this.parseRectangle(param.classPos);
            this.drawActorClass(actor, a[0], a[1], a[2] || 180);
        }
        if (param.levelShow) this._drawLevel(actor, ...this.parseRectangle(param.levelPos));
        a = this.parseRectangle(param.iconsPos);
        if (a[2]) this.drawActorIcons(actor, ...a);
        a = this.parseRectangle(param.hpPos);
        if (a[2]) this.drawActorHp(actor, ...a);
        a = this.parseRectangle(param.mpPos);
        if (a[2]) this.drawActorMp(actor, ...a);
        a = this.parseRectangle(param.tpPos);
        if (a[2]) this.drawActorTp(actor, ...a);

        this.contents.paintOpacity = 48;
        a = this.parseRectangle(param.horzLineYPos);
        for (var i = 0; i < a.length; i++) {
            this.contents.fillRect(0, a[i], this.contentsWidth(), 2, this.normalColor());
        };
        this.contents.paintOpacity = 255;

        if (param.equipShow) {
            let a = this.parseRectangle(param.equipPos), x = a[0], y = a[1];
            const slots = actor.equips();
            actor.equipSlots().forEach(function(slotId, index){
                this.changeTextColor(this.systemColor());
                this.drawText($dataSystem.equipTypes[slotId], x, y, 100, this.lineHeight());
                if (slots[index]){
                    this.drawItemName(slots[index], x + 100, y, a[2] - 100);
                }
                y += param.equipRow;

            }, this);
        }
        if (param.statusShow) {
            let a = this.parseRectangle(param.statusPos), x = a[0], y = a[1] - param.statusRow;
            // ver.1.04変更
            let wid = Math.max(a[2] - 80, 68);
            const re = new RegExp("([XS]?)(\\d+)");
            for (var index = 0; index < param.paramListSW.length; index++) {
                y += param.statusRow;
                if (!re.test(param.paramListSW[index])) continue;
                this.changeTextColor(this.systemColor());

                var mode = RegExp.$1, num = parseInt(RegExp.$2), 
                paramName, paramValue, xPad = 0, percWid = this.textWidth(param.parcentStr);
                if (mode == 'X') {
                    paramName  = param.xParamNames[num];
                    paramValue = actor.xparam(num);
                    xPad = percWid;
                }else if (mode == 'S'){
                    paramName  = param.sParamNames[num];
                    paramValue = actor.sparam(num);
                    xPad = percWid;
                }else{
                    paramName  = TextManager.param(num);
                    paramValue = actor.param(num);
                }
                if (xPad) {
                    paramValue = parseInt(paramValue * 100);
                    this.drawText(param.parcentStr, x, y, a[2], 'right');
                }

                this.drawText(paramName, x, y, wid);
                this.resetTextColor();
                this.drawText(paramValue, x-xPad, y, a[2], 'right');
            }
            // ver.1.04変更ここまで
        }
    }

    Window_ActorInfo.prototype._drawLevel = function(actor, x, y, width=120) {
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.levelA, x, y, 48);
        this.resetTextColor();
        this.drawText(actor.level, x, y, width, 'right');
    }

    //=================================================
    // Scene_KanjiPartyChange
    //=================================================
    function Scene_KanjiPartyChange (){
        return this.initialize.apply(this, arguments);
    }

    Scene_KanjiPartyChange.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_KanjiPartyChange.prototype.constructor = Scene_KanjiPartyChange;

    Scene_KanjiPartyChange.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        const array = $gameSystem.waitingMembers();
        for (let i = 0; i < array.length; i++) {
            if ($gameParty._actors.includes(array[i])) array[i] = null;
        }
        $gameSystem._waitingMembers = array.filter(function(id){ return id !== null } );

        this._originalParty = $gameParty._actors.slice();
        this._originalMembers = $gameSystem._waitingMembers.slice();
        this._originalParty.concat(this._originalMembers).forEach(function(id){
            const actor = $gameActors.actor(id);
            ImageManager.loadFace(actor.faceName());
            ImageManager.loadCharacter(actor.characterName());
            ImageManager.loadSvActor(actor.battlerName());
        });

        this.createMainCommandsWindow();
        this.createActorListWindow();
        this.createReserveMemberWindow();
        this.createStatusWindow();
    }

    Scene_KanjiPartyChange.prototype.start = function() {
        Scene_MenuBase.prototype.start.apply(this, arguments);
        this.actorListWindow.refresh();
        this.reserveMemberWindow.refresh();
    }

    Scene_KanjiPartyChange.prototype.parseRectangle = function(param) {
        var w = Graphics.boxWidth, h = Graphics.boxHeight;
        const rect = eval(param);
        if (Utils.RPGMAKER_NAME === 'MZ') {
            return [new Rectangle(...rect)];
        } else {
            return rect;
        }
    }

    Scene_KanjiPartyChange.prototype.createMainCommandsWindow = function () {
        this.commandWindow = new Window_PCMainCommand(...this.parseRectangle(param.cwPos));
        this.commandWindow.setHandler('change', this.commandChange.bind(this));
        this.commandWindow.setHandler('remove', this.commandRemove.bind(this));
        this.commandWindow.setHandler('revert', this.commandRevert.bind(this));
        this.commandWindow.setHandler('cancel', this.commandFinish.bind(this));
        this.commandWindow.activate();
        this.addWindow(this.commandWindow);
    }

    Scene_KanjiPartyChange.prototype.createActorListWindow = function () {
        let rect = [
            this.commandWindow.width,
            0,
            Graphics.boxWidth - this.commandWindow.width,
            this.commandWindow.height
        ];
        if (Utils.RPGMAKER_NAME === 'MZ') {
            this.actorListWindow = new Window_PCActorList(new Rectangle(...rect));
        } else {
            this.actorListWindow = new Window_PCActorList(...rect);
        }
        this.actorListWindow.setHandler('ok',     this.commandChangeActor.bind(this));
        this.actorListWindow.setHandler('cancel', this.commandCancelActor.bind(this));
        this.addWindow(this.actorListWindow);
    }

    Scene_KanjiPartyChange.prototype.createReserveMemberWindow = function () {
        this.reserveMemberWindow = new Window_ReserveMember(...this.parseRectangle(param.wwPos));
        this.reserveMemberWindow.setHandler('ok',     this.commandOkReserve.bind(this));
        this.reserveMemberWindow.setHandler('cancel', this.commandCancelReserve.bind(this));
        this.addWindow(this.reserveMemberWindow);
    }

    Scene_KanjiPartyChange.prototype.createStatusWindow = function () {
        this.statusWindow = new Window_ActorInfo(...this.parseRectangle(param.swPos));
        this.actorListWindow.setHelpWindow(this.statusWindow);
        this.reserveMemberWindow.setHelpWindow(this.statusWindow);
        this.addWindow(this.statusWindow);
    }

    // Window_PCMainCommand
    Scene_KanjiPartyChange.prototype.commandChange = function () {
        this.actorListWindow.activate();
        this.actorListWindow.select(0);
    }

    Scene_KanjiPartyChange.prototype.commandRemove = function () {
        this.actorListWindow.activate();
        this.actorListWindow.select(0);
    }

    Scene_KanjiPartyChange.prototype.commandRevert = function () {
        $gameParty._actors = this._originalParty.slice();
        $gameSystem._waitingMembers = this._originalMembers.slice();
        this.actorListWindow.refresh();
        this.reserveMemberWindow.refresh();
        this.actorListWindow.select(-1);
        this.commandWindow.activate();
    }

    Scene_KanjiPartyChange.prototype.commandFinish = function () {
        $gamePlayer.refresh();
        this.popScene();
    }

    // Window_PCActorList
    Scene_KanjiPartyChange.prototype.commandChangeActor = function () {
        var id = $gameParty._actors[this.actorListWindow._index],
        actor = $gameActors.actor(id);
        if (actor && actor.kanjiPCLock()) {
            SoundManager.playBuzzer()
            this.actorListWindow.activate();
        }else{
            if (this.commandWindow._index == 1) {
                if ($gameParty._actors.length > 1 && id) {
                    $gameParty._actors = $gameParty._actors.filter(actorId => id !== actorId);
                    $gameSystem._waitingMembers.push(id)
                    this.actorListWindow.refresh();
                    this.reserveMemberWindow.refresh();
                }else{
                    SoundManager.playBuzzer()
                };
                this.actorListWindow.activate();
            } else {
                this.reserveMemberWindow.activate();
                this.reserveMemberWindow.select(0);
            }
        }
    }

    Scene_KanjiPartyChange.prototype.commandCancelActor = function () {
        this.actorListWindow.select(-1);
        this.commandWindow.activate();
    }

    // Window_ReserveMember
    Scene_KanjiPartyChange.prototype.commandOkReserve = function () {
        var id = $gameParty._actors[this.actorListWindow._index],
        data = $gameSystem.waitingMembers();
        if (param.removeOnReserveTerm && this.reserveMemberWindow._index == 0) {
            // 控えメンバーウィンドウからパーティを外した場合
            if ($gameParty._actors.length > 1) {
                if (id) {
                    $gameParty._actors = $gameParty._actors.filter(actorId => id !== actorId);
                    data.push(id)
                }
            }else{
                SoundManager.playBuzzer()
            };
        }else{
        // 控えメンバーウィンドウのアクターを選んだ場合
            var index = this.reserveMemberWindow._index - (param.removeOnReserveTerm ? 1 : 0);
            if (id) {
                // パーティにアクターがいる。
                $gameParty._actors[this.actorListWindow._index] = data[index];
                data[index] = id;
            }else{
                // パーティウィンドウで選んだところにアクターがいない
                $gameParty._actors.push(data[index]);
                id = data[index];
                $gameSystem._waitingMembers = data.filter(actorId => actorId !== id);
            }
        }
        this.actorListWindow.refresh();
        this.reserveMemberWindow.refresh();
        this.actorListWindow.activate();
        this.reserveMemberWindow.select(-1);
    }

    Scene_KanjiPartyChange.prototype.commandCancelReserve = function () {
        this.actorListWindow.activate();
        this.reserveMemberWindow.select(-1);
    };

    // MV/MZ用に互換する
    ([
        Window_PCActorList,
        Window_PCMainCommand,
        Window_ReserveMember,
        Window_ActorInfo,
    ]).forEach(function(klass){
        if (Utils.RPGMAKER_NAME === 'MZ') {
            klass.prototype.normalColor = function() {
                return ColorManager.normalColor();
            }
    
            klass.prototype.systemColor = function() {
                return ColorManager.systemColor();
            }
    
            klass.prototype.drawActorCharacter = function(actor, x, y) {
                this.drawCharacter(actor.characterName(), actor.characterIndex(), x, y);
            }
    
            klass.prototype.drawActorFace = function(actor, x, y, width, height) {
                this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
            }

            klass.prototype.drawActorHp = function(actor, x, y, w){
                Window_StatusBase.prototype.placeGauge.call(this, actor, 'hp', x, y, w);
            };
    
            klass.prototype.drawActorMp = function(actor, x, y, w){
                Window_StatusBase.prototype.placeGauge.call(this, actor, 'mp', x, y, w);
            };
    
            klass.prototype.drawActorTp = function(actor, x, y, w){
                Window_StatusBase.prototype.placeGauge.call(this, actor, 'tp', x, y, w);
            };
        }
    }, this);

    Object.assign(this.exports, {
        Window_PCActorList,
        Window_PCMainCommand,
        Window_ReserveMember,
        Window_ActorInfo,
        Scene_KanjiPartyChange,
    });
}).call(KanjiPartyChange);