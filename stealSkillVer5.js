/*:

完成品

@plugindesc
モンスターからアイテムを盗めるようにするプラグインです

@author
シトラス

@param stealCountVariableId
@desc ここで指定した番号の変数で盗んだ回数をカウントできるようになります
0なら使用しません
@default	0

@help
盗むスキルと、モンスターから盗めるアイテムを設定できるようになります

盗めるアイテムの設定

モンスターのメモ欄に、
<STEAL_ITEM:KIND,(種類),ID,(ＩＤまたは金額),PERMIL,(確率を千分率で表記)>
と表記してください。

例１：
<STEAL_ITEM:KIND,1,ID,1000,PERMIL,500>
お金1000を50%の確率で盗める

例２：
<STEAL_ITEM:KIND,2,ID,3,PERMIL,100>
ID3のアイテムを10%の確率で盗める

例３：
<STEAL_ITEM:KIND,3,ID,10,PERMIL,20>
ID10の武器を2%の確率で盗める

例４：
<STEAL_ITEM:KIND,4,ID,30,PERMIL,4>
ID30の防具を0.4%の確率で盗める

スキルの設定
スキルのメモ欄に、<skill:盗む>と表記すれば、いわゆる盗むスキルになります
盗むだけでダメージなどを与えないスキルにしたい場合、
効果で何も効果がないステートを付与してください

*/
(function(){
	var stealCountVariableId = Number(PluginManager.parameters("stealSkillVer5").stealCountVariableId);
	
	//初期化処理
	var _Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
	Game_Enemy.prototype.initMembers = function() {
		_Game_Enemy_initMembers.call(this);
		
		//盗めるアイテムの種類
		this._stealItemKind   = 0;
		
		//盗めるアイテムのID
		this._stealItemId     = 0;
		
		//アイテムを盗める確率
		this._stealItemPermil = 0;
		
		//アイテムを持っているか
		this._haveItem = false;
	};
	
	var _Game_Enemy_setup = Game_Enemy.prototype.setup;
	Game_Enemy.prototype.setup = function(enemyId, x, y) {
		_Game_Enemy_setup.call(this,enemyId, x, y)
		
		//盗めるアイテムのデータを取得
		console.log(this.enemy().meta);
		var stealItemData = this.enemy().meta.STEAL_ITEM;
		console.log(stealItemData);
		if(stealItemData !== undefined){
			stealItemData = stealItemData.match(/KIND,([1-4]),ID,(\d+),PERMIL,(\d+)/);
			this._stealItemKind   = Number(stealItemData[1] );
			this._stealItemId     = Number(stealItemData[2] );
			this._stealItemPermil = Number(stealItemData[3] );
			this._haveItem = true;
		}
	};
	Game_Enemy.prototype.stealItemKind = function(){
		return this._stealItemKind;
	};
	Game_Enemy.prototype.stealItemId = function(){
		return this._stealItemId;
	};
	Game_Enemy.prototype.stealItemPermil = function(){
		return this._stealItemPermil;
	};
	Game_Enemy.prototype.haveItem = function(){
		return this._haveItem;
	};

	//攻撃の処理
	var _Game_Action_apply = Game_Action.prototype.apply;
	Game_Action.prototype.apply = function(target) {
		_Game_Action_apply.call(this,target);
		if(target.result().isHit() ){
			this.stealApply(target);
		}
	};

	function getItemName (item) {
		return `\\i[${item.iconIndex}]` + item.name;
	}
	
	//盗みの処理
	Game_Action.prototype.stealApply = function(target){
		if(target.isEnemy() ){
			if(this.item().meta.skill == "盗む"){
				$gameMessage.newPage();
				$gameMessage.setFaceImage("", 0);
				$gameMessage.setBackground(0);
				$gameMessage.setPositionType(2);
				if(target.haveItem() == false){
					$gameMessage.add("何も持っていない！");
				}else{
					if(Math.random()*1000 < target.stealItemPermil() ){
						//盗みに成功した場合
						//盗みの成功回数を加算する
						if(0 < stealCountVariableId){
							var oldValue = $gameVariables.value(stealCountVariableId);
							$gameVariables.setValue(stealCountVariableId,oldValue + 1);
						}
						target._haveItem = false;
						var dataId = target.stealItemId();
						var itemName = "";
						switch(target.stealItemKind() ){
							case 1:
							//お金の場合
							$gameParty.gainGold(dataId);
							itemName = dataId + TextManager.currencyUnit;
							break;
							case 2:
							//アイテムの場合
							$gameParty.gainItem($dataItems[dataId],1);
							itemName = getItemName($dataItems[dataId]);
							break;
							case 3:
							//武器の場合
							$gameParty.gainItem($dataWeapons[dataId],1);
							itemName = getItemName($dataWeapons[dataId]);
							break;
							case 4:
							//防具の場合
							$gameParty.gainItem($dataArmors[dataId],1);
							itemName = getItemName($dataArmors[dataId]);
							break;
						}
						$gameMessage.add(itemName+"を盗んだ！");
					}else{
						$gameMessage.add("盗めなかった！");
					}
				}
			}
		}
	};
})();