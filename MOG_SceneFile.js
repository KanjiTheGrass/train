//=============================================================================
// MOG_SceneFile.js
//=============================================================================
/*:
 * @plugindesc ※AdditionalPatchForMOGbyKanjiより上
 (v1.0)セーブ/ロード画面を変更します。
 * @author Moghunter Edit by 莞爾の草
 *
 * @param SaveFileNumber 
 * @text セーブファイル数
 * @type number
 * @default 4
 *
 * @param Font Size
 * @text フォントサイズ
 * @desc セーブ画面全体のフォントサイズを設定します。
 * @type number
 * @default 22
 *
 * @param Text Color
 * @text 文字の色
 * @desc テキストの色を設定します。色の指定はメッセージの\c[n]と同じ要領でnの部分だけ入れてください
 * @type number
 * @default 21
 *
 * @param Actor X-Axis
 * @text 立ち絵表示（X座標）
 * @desc ファイルのアクターの立ち位置を設定できます。
 * @type number
 * @default 100
 *
 * @param Actor Y-Axis
 * @text 立ち絵表示（Y座標）
 * @desc ファイルのアクターの立ち位置を設定できます。
 * @type number
 * @default 0
 *
 * @param Help X-Axis
 * @text ヘルプウィンドウのX座標
 * @desc ヘルプウィンドウの表示位置を設定できます。
 * @type number
 * @default 0
 *
 * @param Help Y-Axis
 * @text ヘルプウィンドウのY座標
 * @desc ヘルプウィンドウの表示位置を設定できます。
 * @type number
 * @default 30
 *
 * @param Cursor X-Axis
 * @text カーソル原点（X座標）
 * @desc カーソルの画像（Cursor.png）の原点を設定できます
 * @type number
 * @default 372
 * 
 * @param Cursor Y-Axis
 * @text カーソル原点（Y座標）
 * @desc カーソルの画像（Cursor.png）の原点を設定できます
 * @type number
 * @default 0
 * 
 * @param Cursor File Space
 * @text ファイル同士の横間隔
 * @desc ファイル同士の横の間隔を指定してください。
 * @type number
 * @default 177
 * 
 * @param Word Playtime
 * @text Playtimeの文字列
 * @desc Playtimeの文字列を変更できます。
 * @type number
 * @default Playtime
 *
 * @param File PT X-Axis
 * @text Playtimeの表示位置（X座標）
 * @type number
 * @default 8
 *
 * @param File PT Y-Axis
 * @text Playtimeの表示位置（Y座標）
 * @type number
 * @default 90
 *
 * @param Word Location
 * @text Locationの文字列
 * @desc Locationの文字列を変更できます。
 * @type number
 * @default Location
 *
 * @param File LC X-Axis
 * @text Locationの表示位置（X座標）
 * @type number
 * @default 8
 *
 * @param File LC Y-Axis
 * @text Locationの表示位置（Y座標）
 * @type number
 * @default 120
 *
 * @help  
 * =============================================================================
 * +++ MOG - Scene File (v1.0) +++
 * By Moghunter 
 * https://atelierrgss.wordpress.com/
 * -----------------------------------------------------------------------------
 * このプラグインで使用する画像は下記のディレクトリに入っています。
 * /img/menus/file/
 * =============================================================================
 *
 * この画面に表示されるアクターの立ち絵は
 * /img/pictures/
 * の中に以下のの形式でいれてください。
 * Actor_(ID).png
 * 例）
 * Actor_1.png
 * Actor_2.png
 * Actor_3.png 
 *...
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_SceneFile = true;
　　var Moghunter = Moghunter || {}; 

  　Moghunter.parameters = PluginManager.parameters('MOG_SceneFile');
	Moghunter.scFile_FontSize = Number(Moghunter.parameters['Font Size'] || 22);
	Moghunter.scFile_TextColor = Number(Moghunter.parameters['Text Color'] || 21);
	Moghunter.scFile_PlayTimeWord = String(Moghunter.parameters['Word Playtime'] || "Playtime");
	Moghunter.scFile_LocationWord = String(Moghunter.parameters['Word Location'] || "Location");
    Moghunter.scFile_ActorX = Number(Moghunter.parameters['Actor X-Axis'] || 100);
    Moghunter.scFile_ActorY = Number(Moghunter.parameters['Actor Y-Axis'] || 0);
	Moghunter.scFile_HelpX = Number(Moghunter.parameters['Help X-Axis'] || 0);
	Moghunter.scFile_HelpY = Number(Moghunter.parameters['Help Y-Axis'] || 30);
	Moghunter.scFile_CursorX = Number(Moghunter.parameters['Cursor X-Axis'] || 372);
	Moghunter.scFile_CursorY = Number(Moghunter.parameters['Cursor Y-Axis'] || 0);
	Moghunter.scFile_CursorS = Number(Moghunter.parameters['Cursor File Space'] || 172);
	Moghunter.scFile_PTX = Number(Moghunter.parameters['File PT X-Axis'] || 0);
	Moghunter.scFile_PTY = Number(Moghunter.parameters['File PT Y-Axis'] || 90);
	Moghunter.scFile_LCX = Number(Moghunter.parameters['File LC X-Axis'] || 0);
	Moghunter.scFile_LCY = Number(Moghunter.parameters['File LC Y-Axis'] || 120);
	Moghunter.scFile_ParS = Number(Moghunter.parameters['File Par Space']  || 200);
	Moghunter.saveFileNumber = Number(Moghunter.parameters['SaveFileNumber']  || 4);
	
//=============================================================================
// ** ImageManager
//=============================================================================

//==============================
// * Menus
//==============================
ImageManager.loadMenusFile = function(filename) {
    return this.loadBitmap('img/menus/file/', filename, 0, true);
};
	
//==============================
// * Max Save File Info
//==============================
DataManager.maxSavefiles = function() { return Moghunter.saveFileNumber };

DataManager.makeSavefileInfo = function() {
    var info = {};
    info.globalId   = this._globalId;
    info.title      = $dataSystem.gameTitle;
	info.members    = $gameParty.members();
	if ($gameMap.displayName()) {
    	  info.location   = $gameMap.displayName();
	} else {
		if ($dataMapInfos[$gameMap._mapId]) {
		  info.location = $dataMapInfos[$gameMap._mapId].name;
		} else {
		  info.location = "";
		};
	};
	var actor = info.members[0];
	info.actor = [actor.name(),actor.level,actor.mhp,actor.mmp,actor.atk,actor.def,
	              actor.mat,actor.mdf,actor.agi,actor.luk,actor._actorId];
	info.gold       = $gameParty.gold();   
    info.characters = $gameParty.charactersForSavefile();
    info.faces      = $gameParty.facesForSavefile();
    info.playtime   = $gameSystem.playtimeText();
    info.timestamp  = Date.now();
    return info;
};

//=============================================================================
// ** Window Save File List
//=============================================================================

//==============================
// * initialize
//==============================
var _mog_sfile_wsav_initialize = Window_SavefileList.prototype.initialize;
Window_SavefileList.prototype.initialize = function(x, y, width, height) {
    _mog_sfile_wsav_initialize.call(this,x, y, width, height)
	this.visible = false;
};

//=============================================================================
// ** Scene File
//=============================================================================

//==============================
// * initialize
//==============================
var _mog_sfile_sf_initialize = Scene_File.prototype.initialize; 
Scene_File.prototype.initialize = function() {
    _mog_sfile_sf_initialize.call(this);
	this._fIndex = -DataManager.maxSavefiles();
	this._actorIndex = -1; 
};

//==============================
// * create
//==============================
var _mog_sfile_create = Scene_File.prototype.create;
Scene_File.prototype.create = function() {
    _mog_sfile_create.call(this)
	this.createActorPicture();
	this.createCursor();
	this.createLayout();
    this.createWindowData();
	this._listWindow.x = (this._listWindow.width * 2);
	if (this._listWindow._index < 0 || this._listWindow._index > DataManager.maxSavefiles() ) {
		this._listWindow._index = 0};
	 this._Cursor.x = Moghunter.scFile_CursorX + (Moghunter.scFile_CursorS * this._listWindow._index);
};
	
//==============================
// * Create Mbackground
//==============================
Scene_File.prototype.create_mbackground = function() {
};	

//==============================
// * Update MBackground
//==============================
Scene_File.prototype.update_mbackground = function() {
};	

//==============================
// * create Background
//==============================
Scene_File.prototype.update_mbackgr
var _mog_sfile_createBackground = Scene_File.prototype.createBackground;
Scene_File.prototype.createBackground = function() {
    _mog_sfile_createBackground.call(this);
    this._backgroundSprite.bitmap = ImageManager.loadMenusFile("background");

};
	
//==============================
// * create Actor Picture
//==============================
Scene_File.prototype.createActorPicture = function() {
     this._ActorPicture = new Sprite();
	 this._ActorPicture.anchor.x = 0.5;
	 this.addChild(this._ActorPicture);
};

//==============================
// * create Layout
//==============================
Scene_File.prototype.createLayout = function() {
     this._layout = new Sprite(ImageManager.loadMenusFile("layout"));
	 this.addChild(this._layout);
};

//==============================
// * create Cursor
//==============================
Scene_File.prototype.createCursor = function() {
     this._Cursor = new Sprite(ImageManager.loadMenusFile("cursor"));
	 this._Cursor.opacity = 0;
	 this.addChild(this._Cursor);
};

//==============================
// * update Cursor
//==============================
Scene_File.prototype.updateCursor = function() {
     var nx = Moghunter.scFile_CursorX + (Moghunter.scFile_CursorS * this._listWindow._index);
	 var ny = Moghunter.scFile_CursorY;
	 this._Cursor.x = this.barCMT(this._Cursor.x,nx);
	 this._Cursor.y = this.barCMT(this._Cursor.y,ny);
	 if (this._Cursor.opacity < 120) {this._Cursor.opacity += 10};
};

//==============================
// * next Index
//==============================
Scene_File.prototype.nextIndex = function(value) {
     SoundManager.playCursor();
	 this._listWindow._index += value + DataManager.maxSavefiles();
	 this._listWindow._index %= DataManager.maxSavefiles();
}; 

//==============================
// * update Command
//==============================
Scene_File.prototype.updateCommand = function() {
	if (Input.isRepeated("right")) {this.nextIndex(1)}
	else if (Input.isRepeated("left")) {this.nextIndex(-1)}
	if (TouchInput.isTriggered()) {this.checkTouchFile()};
};

//==============================
// * check Touch File
//==============================
Scene_File.prototype.checkTouchFile = function() {
	var oldIndex = this._listWindow._index;
	var onfile = false
	for (i = 0; i < DataManager.maxSavefiles(); i++) {
         if (this.isOnFile(i)) {
			 this._listWindow._index = i;
			 onfile = true;
		 };
	};
	if (!onfile) {return};
	if (oldIndex === this._listWindow._index) {
		this._listWindow.processOk();
	} else {
		SoundManager.playCursor();
	};
};

//==============================
// * On Picture Com
//==============================
Scene_File.prototype.isOnFile = function(index) {	 
     var x = Moghunter.scFile_CursorX + (Moghunter.scFile_CursorS * index);
	 var y = Moghunter.scFile_CursorY;		 
	 var cw = this._Cursor.bitmap.width;
	 var ch = this._Cursor.bitmap.height;
	 if (TouchInput.x < x) { return false};
	 if (TouchInput.x > x + cw) { return false};
	 if (TouchInput.y < y) { return false};
	 if (TouchInput.y > y + ch) { return false};
	 return true;	 
};	
	

//==============================
// * bar CMT
//==============================
Scene_File.prototype.barCMT = function(value,real_value) {
	if (value == real_value) {return value};
	var dnspeed = 5 + (Math.abs(value - real_value) / 10);
	if (value > real_value) {value -= dnspeed;
	    if (value < real_value) {value = real_value};}
    else if (value < real_value) {value  += dnspeed;
    	if (value  > real_value) {value  = real_value};		
    };
	return Math.floor(value);
};

//==============================
// * refresh Actor Picture
//==============================
Scene_File.prototype.refreshActorPicture = function() {
      this._actorIndex =  this._dataWindow.actorID();
	  this._ActorPicture.bitmap = null;
	  if (!this._actorIndex) {return};
	  this._ActorPicture.bitmap = ImageManager.loadPicture("Actor_" + String(this._actorIndex));
	  this._ActorPicture.x = Moghunter.scFile_ActorX - 100;
	  this._ActorPicture.opacity = 0;
};

//==============================
// * update Actor Picture
//==============================
Scene_File.prototype.updateActorPicture = function() {
 	  if (!this._ActorPicture.bitmap || !this._ActorPicture.bitmap.isReady()) {return};
	  if (this._ActorPicture.x < Moghunter.scFile_ActorX) {
	      this._ActorPicture.x += 3;
	      this._ActorPicture.opacity += 10;
		  if (this._ActorPicture.x >= Moghunter.scFile_ActorX) {
			  this._ActorPicture.x = Moghunter.scFile_ActorX;
			  this._ActorPicture.opacity = 255;
		  };
      };
	  this._ActorPicture.y = (Graphics.boxHeight - this._ActorPicture.height) + Moghunter.scFile_ActorY;
};

//==============================
// * create Window Data
//==============================
Scene_File.prototype.createWindowData = function() {
	 this._dataWindow = new Window_FileData(0,0,Graphics.boxWidth,Graphics.boxHeight);
	 this.addChild(this._dataWindow);
};

//==============================
// * refresh Window Data
//==============================
Scene_File.prototype.refreshDataWindow = function() {
	this._fIndex = this._listWindow._index;
	this._dataWindow.setData(this._fIndex);
	this.refreshActorPicture()
};

//==============================
// * update
//==============================
var _mog_sfile_sf_update = Scene_File.prototype.update;
Scene_File.prototype.update = function() {
	_mog_sfile_sf_update.call(this);
	if (this._fIndex != this._listWindow._index) {this.refreshDataWindow()};
	this.updateActorPicture();
	this.updateCursor();	
	if (!SceneManager.isSceneChanging()) {this.updateCommand()};
	this._helpWindow.opacity = 0;
	this._helpWindow.x = Moghunter.scFile_HelpX;
	this._helpWindow.y = Moghunter.scFile_HelpY;
	
};


//=============================================================================
// ** Window FileData
//=============================================================================
function Window_FileData() {
    this.initialize.apply(this, arguments);
}

Window_FileData.prototype = Object.create(Window_Base.prototype);
Window_FileData.prototype.constructor = Window_FileData;

//==============================
// * initialize
//==============================
Window_FileData.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.active = false;
    this._fileIndex = 0;
	this._actorID = null;
	this._dataInfo = null;
	this.contents.fontSize = Moghunter.scFile_FontSize;
};

//==============================
// * data
//==============================
Window_FileData.prototype.data = function() {
	return this._dataInfo;
};

//==============================
// * actor ID
//==============================
Window_FileData.prototype.actorID = function() {
	return this._actorID;
};

//==============================
// * set Data
//==============================
Window_FileData.prototype.setData = function(index) {
	this._fileIndex = index;
	this._dataInfo = DataManager.loadSavefileInfo(this._fileIndex + 1);
	this.refresh();
};

//==============================
// * refresh
//==============================
Window_FileData.prototype.refresh = function() {
	 if (this.contents) {this.contents.clear()};
	 this._actorID = null;
	 if (this.data()) {this.drawData() 
	 } else {
		this.drawText("- No Data - ", 110, (this.height / 2), 120, 'center'); 
	 };
};

Window_FileData.prototype.standardPadding = function() {
    return 0;
};

//==============================
// * Update
//==============================
Window_FileData.prototype.update = function() {
     Window_Base.prototype.update.call(this);
	 this.opacity = 0;
};

Window_FileData.prototype.drawData = function() {
    var actor = this.data().actor;
	const xP = Moghunter.scFile_PTX, yP = Moghunter.scFile_PTY,
	xL = Moghunter.scFile_LCX, yL = Moghunter.scFile_LCY,
	w = 120;
    this._actorID = actor[10];
    this.changeTextColor(this.textColor(Moghunter.scFile_TextColor));
    this.drawText(String(Moghunter.scFile_PlayTimeWord), xP, yP, w, 'left');
    this.drawText(String(Moghunter.scFile_LocationWord), xL, yL, w, 'left');
    this.resetTextColor();	  
    this.drawText(this.data().playtime, xP + w, yP, 160, 'right');
    this.drawText(this.data().location, xL + w, yL, 160, 'right');
};