/*:
 * @target MZ
 * @plugindesc [ver.1.0.0]汎用ダメージ計算式を登録して一括管理します。
 * @author 莞爾の草
 * @url https://kanjinokusargss3.hatenablog.com/
 * 
 * @help
 * ■こんな方にお勧め
 * 「ファイア、アイス、サンダー……ホーリー、ダークネスと
 * 　１６属性の基礎魔法を作ってダメージ計算式を同じものに
 * 　設定してたけど、後で式を変えるときにコピペ作業が面倒くさそう……」
 * 「ダメージ計算式をもっと複雑にしたいけどツクールのエディタじゃスペースが
 * 　狭すぎて見づらいしやりたいことができない……」
 * 　この悩み、このプラグインで解決します。
 * 
 * ■使用方法
 * プラグインパラメータに汎用的に使用したい計算式とその名称を指定し、
 * スキルやアイテムの「ダメージ>計算式」の欄に下記のように指定することで
 * その式を呼び出すことができます。
 * KNS＠指定した名前(引数)
 * 例）
 * KNS＠random100();
 * KNS＠fibonacci(50);
 * KNS＠physicalDamage(2, 1);
 * ※＠マークには半角も使えます。
 * 
 * また、上記記述を通常の式の途中で使うことも可能です。
 * 例）
 * 900 - KNS＠random100();
 * (KNS＠physicalDamage(2, 1) * 2) - 100
 * 
 * ■計算式の書き方
 * 　ダメージ計算式を登録する際は式の末尾にダメージと
 * なる値、またはその値を持った変数名を指定しreturnで
 * 終わらせてください。
 * （サンプルとして初期パラメータを参照）
 * 
 * 　パラメータ内でも通常の計算式同様a, b, vのローカル変数を
 * 使うことができるほか、計算式欄で指定した引数をargsという
 * ローカル変数で受け取ることができます。
 * 例）
 * KNS＠magicalDamage(2, 1);
 * ↓
 * KNS＠magicalDamage(4, 1);
 * （引数の値を変えることでスキルごとに威力の調整が可能）
 * 
 * 以下式を書く際の情報など
 * ■演算子(JavaScriptと同様)
 * +  ... 足し算  -  ... 引き算
 * *  ... 掛け算  /  ... 割り算
 * %  ... 余り算 例) 13 % 2 = 1
 * ** ... 累乗   例) 2 ** 8 = 256
 * () ... ()の中の式を優先して計算します。
 * 
 * ■数学的な要素
 * Math.PI: 円周率の近似値(3.141592653589793)を返します。
 * Math.sqrt(x): xの平方根を返します。
 * Math.abs(x): xの絶対値を返します。
 * Math.floor(x): xの小数を切り捨て整数にして返します。
 * Math.ceil(x): xの小数を切り上げ整数にして返します。
 * Math.round(x): xの小数を四捨五入して整数で返します。
 * Math.random(): 0.00以上1.00未満の乱数を小数で返します。
 * 例）
 * Math.floor(Math.random() * 101)
 * => 0から100までの乱数を返します。
 * 
 * Math.abs(Math.floor(Math.random() * 101) - 50)
 * => 0から100までの乱数から50を引いた絶対値を返します。
 * 
 * * JavaScriptでは小数があいまいに扱われるため、
 * 　正確な結果を求める際には小数部分を整数に直すなど
 * 　調整が必要です。
 * * その他三角関数やlogなどの必要な要素については
 * 　下記リンクをご参照ください。
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math
 * 
 * ■a, bに指定できるパラメータ
 * hp: 現在のHP  mp: 現在のMP
 * tp: 現在のTP  maxTp(): 最大TP(デフォルトでは100)
 * level: *レベル
 * *敵にレベルを指定するプラグインを入れていない場合注意
 * 
 * hpRate(): HPと最大HPの割合を小数で返します。
 * mpRate(): MPと最大MPの割合を小数で返します。
 * tpRate(): TPと最大TPの割合を小数で返します。
 * 
 * ●以下param(n)で指定可
 * 0. mhp: 最大HP  1. mmp: 最大MP
 * 2. atk: 攻撃力  3. def: 防御力
 * 4. mat: 魔攻力  5. mdf: 魔防力
 * 6. agi: 俊敏性  7. luk: 運(ステート耐性)
 * 
 * ●以下xparam(n)で指定可
 * 0. hit: 命中率     1. eva: 回避率
 * 2. cri: 会心率     3. cev: 会心回避率
 * 4. mev: 魔法回避率 5. mrf: 魔法反射率
 * 6. cnt: 反撃率     7. hrg: HP再生率
 * 8. mrg: MP再生率   9. trg: TP再生率
 * 
 * ●以下sparam(n)で指定可
 * 0. tgr: 狙われ率         1. grd: 防御効果倍率
 * 2. rec: 回復効果倍率     3. pha: *薬の知識
 * 4. mcr: MP消費倍率       5. tcr: TP消費倍率
 * 6. pdr: 物理ダメージ倍率 7. mdr: 魔法ダメージ倍率
 * 8. fdr: 床ダメージ倍率   9. exr: 獲得経験値倍率
 * *使用効果「HP回復」にかける倍率
 * 
 * ●その他便利なもの
 * $gameMap.mapId()      : 現在のマップIDを返す
 * $gameParty.size()     : 味方の人数を返す
 * $gameParty.gold()     : 所持金の値を返す
 * $gameParty.steps()    : 歩数の値を返す
 * $gameSystem.saveCount()   : セーブ回数を返す
 * $gameSystem.battleCount() : 戦闘回数を返す
 * $gameSystem.winCount()    : 戦闘勝利回数を返す
 * $gameSystem.escapeCount() : 逃走回数を返す
 * 
 * $gameParty.numItems($dataItems[id])
 * =>アイテムid番目の所持数を返す
 * $gameParty.numItems($dataWeapons[id])
 * =>武器id番目の所持数を返す
 * $gameParty.numItems($dataArmors[id])
 * =>防具id番目の所持数を返す
 * 
 * ●if文、三項演算子で使えるもの
 * $gameParty.hasItem($dataItems[id])
 * =>アイテムid番目を持っているか(true/false)
 * $gameParty.hasItem($dataWeapons[id])
 * =>武器id番目を持っているか(true/false)
 * $gameParty.hasItem($dataArmors[id])
 * =>防具id番目を持っているか(true/false)
 * 
 * その他色々使うことができるので探してみると面白いかもしれません。
 * 
 * ■やや技術者向け
 * 　計算式にif文(○○であればこの処理をし、そうでなければ別の処理をするフロー)を
 * 実装することも可能ではありますが式が長くなるため、「三項演算子」を使うことをお勧めします。
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
 * 
 * if文を使った場合)
 *   var n1 = Math.floor(Math.random() * 101);
 *   var n2;
 *   if (n1 >= 50){ // n1が50以上の場合
 *     n2 = n1 / 2;
 *   }else{
 *     n2 = n1;
 *   }
 *   return n2; // 返り値として変数n2を置く
 * 
 * 三項演算子を使った場合)
 *   var n1 = Math.floor(Math.random() * 101);
 *   return (n1 >= 50 ? n1 / 2 : n1);
 * 
 * 　エラーが発生した場合はツクール標準の機能通り0ダメージとなりますが、
 * KNS＠を用いた場合はエラー原因がconsoleに表示されます。
 * 
 * ■更新履歴
 * ver.1.0.0(2022/3/17)
 * - 公開
 * 
 * @param damageFormulas
 * @text 計算式一覧
 * @type struct<formula>[]
 * @desc 汎用計算式を管理します。
 * @default ["{\"name\":\"random100\",\"formula\":\"\\\"// これはコメントです\\\\nreturn Math.floor(Math.random() * 101);\\\"\"}","{\"name\":\"fibonacci\",\"formula\":\"\\\"var cache = {};\\\\n// フィボナッチ数列を再帰的に計算します。\\\\nfunction fibonacci(n){\\\\n  if (n < 1){\\\\n    return 0;\\\\n  }else if(n <= 2){\\\\n    return 1;\\\\n  }else{\\\\n    if (cache[n] == undefined){\\\\n      cache[n] = fibonacci(n - 1) + fibonacci(n - 2)\\\\n    }\\\\n    return cache[n];\\\\n  }\\\\n}\\\\nreturn fibonacci(args[0]);\\\"\"}","{\"name\":\"physicalDamage\",\"formula\":\"\\\"return a.atk * args[0] - b.def * args[1];\\\"\"}","{\"name\":\"magicalDamage\",\"formula\":\"\\\"return a.mat * args[0] - b.mdf * args[1];\\\"\"}"]
 */
/*~struct~formula:
 * @param name
 * @text 計算名
 * @type string
 * @desc 半角英数字のみ。数字から始まる、スペース、"$"のみは使えません。名前の重複禁止。
 * @default plain
 * 
 * @param formula
 * @text 計算式
 * @type note
 * @desc 行末にreturn (値か変数);を必ず指定してください。引数はargs[n]という形で参照可能。a=使用者、b=対象、v[n]=ゲーム変数。;
 * @default "return 0;"
 */
var KNS_Damage = {
	$:{
		name: 'KNS_Damage',
		ReFormula: /KNS[\@＠](.+?\()/g,
		FormulaAddArgs: "KNS_Damage.%1item, a, b, ",

		functions: {},
		getParameter: function(){
			return PluginManager.parameters(this.name);
		},
		initParameters: function(){
			var param = this.getParameter();
			var damageFormulas = JsonEx.parse(param.damageFormulas) || [];
			damageFormulas.forEach(function(formula){
				var json = JsonEx.parse(formula);
				var name = json.name;
				this.functions[name] = new Function('item', 'a', 'b', 'v', 'args', JsonEx.parse(json.formula));
				KNS_Damage[name] = this.executeFormula.bind(this, name);
			}, this);
		},
		executeFormula: function(){
			try{
				var args = Array.prototype.slice.call(arguments);
				var name = args.shift();
				var item = args.shift();
				var a = args.shift();
				var b = args.shift();
				var v = $gameVariables._data;
				return this.functions[name](item, a, b, v, args);
			}catch(e){
				console.log(e);
				return 0;
			}
		},
		replaceFormula: function(formula){
			var fmt = this.FormulaAddArgs;
			return formula.replace(this.ReFormula, function(_, n){ return fmt.format(n); });
		}
	},
};

(function(){
	KNS_Damage.$.initParameters();

	var _Game_Action_evalDamageFormula = Game_Action.prototype.evalDamageFormula;
	Game_Action.prototype.evalDamageFormula = function(target){
		var item = this.item(), oldFormula = null;
		if (item){
			oldFormula = item.damage.formula;
			item.damage.formula = KNS_Damage.$.replaceFormula(oldFormula);
		}
		var value = _Game_Action_evalDamageFormula.apply(this, arguments);
		if (oldFormula !== null){
			item.damage.formula = oldFormula;
		}
		return value;
	};
})();