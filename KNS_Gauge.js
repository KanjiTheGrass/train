// ↓即時関数	(function(引数){ 中身 })(渡す引数)というような形で
//				実行することで変数のスコープを関数の中だけ閉じ込めることができる。
//				これで他人のプラグインと同じ変数名を使っても競合しなくなる
(function(){
	Window_Base.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
		// Bitmapクラスは_contextというプロパティを持っており
		// この中にcanvasのcontextが存在する
		// ↓ WindowのcontentsもBitmapクラスである
		const ctx = this.contents._context;
		ctx.save();	// contextの現状の描画設定を保存する(他との競合防止のため)
		const radius = 36;	// 円の半径
		ctx.lineWidth = 9;	// ゲージの太さ。strokeの場合のみ有効

		//ゲージ背景
		// ↓ 塗る色を指定する
		ctx.strokeStyle = this.gaugeBackColor();// カラーコードの文字列
		ctx.beginPath();	// パスを描き始めるときに前のパス情報をリセットする命令

		//円を描く
		// arc(原点X, 原点Y, 半径, 開始角度, 終着角度, [時計回りにするかのbool])
		// 角度はラジアン角で指定する必要がある。360度はMath.PI * 2
		ctx.arc(x + radius, y, radius, 0, Math.PI * 2);

		ctx.closePath();	// パスを閉じて開始地点と終了地点を直線でつなぐ
		ctx.stroke();

		//ゲージ本体
		ctx.lineWidth = 7;

		//グラデーションオブジェクトを生成する
		// createLinearGradient(開始X, 開始Y, 終着X, 終着Y)
		const grad = ctx.createLinearGradient(x, y, x + width, y);
		//グラデーションに色を追加する
		// addColorStop(0.0～1.0までの小数, 色)
		grad.addColorStop(0.0, color1);// 0に近いほど開始地点の色に近くなる
		grad.addColorStop(1.0, color2);// 1に近いほど終着地点の色に近くなる
		ctx.strokeStyle = grad;

		ctx.beginPath();
		ctx.arc(x + radius, y, radius, 0, Math.PI * 2 * rate);
		ctx.stroke();

		this.contents._setDirty(); // Bitmapに画像が変更されたことを伝える関数
		ctx.restore(); // save()で保存された描画設定を復元する
	};
})();