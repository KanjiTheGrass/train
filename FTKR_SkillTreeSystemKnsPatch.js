/*:
 * @author 莞爾の草
 * @plugindesc [ver.1.0.0]FTKR_SkillTreeSystemの直下に設置してください
 * @help
 * 　スキルツリーシーンにてページアップ/ページダウンキーの割り当てを
 * 解除し、先頭にいるメンバーのみを参照するよう変更しました。
 * 　メニューコマンドからスキルツリーを開く際アクターを選択する処理も
 * なくなります。
 * 
 * ■更新履歴
 * ver.1.0.0
 * - デモ公開
 */
(function(){
var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    _Scene_Menu_createCommandWindow.call(this);
    if (FTKR.STS.showCommand === 1) {
        this._commandWindow.setHandler(
            'learn skill', SceneManager.push.bind(SceneManager, Scene_STS)
        );
    }
};

Scene_STS.prototype.updateActor = function() {
    this._actor = $gameParty.members()[0];
};

var _Scene_STS_createTreeTypeWindow = Scene_STS.prototype.createTreeTypeWindow;
Scene_STS.prototype.createTreeTypeWindow = function(){
    _Scene_STS_createTreeTypeWindow.call(this);
    this._stsTreeTypeWindow.setHandler('pagedown', undefined);
    this._stsTreeTypeWindow.setHandler('pageup',   undefined);
};
})();