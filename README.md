# geometric_linzklar

簡単な幾何学的図形だけで燐字をそこそこきれいに書きたい

![](https://github.com/sozysozbot/geometric_linzklar/blob/master/400.png)

## 燐字 is なに
我々が創作している文字体系。詳細は[別リポジトリのREADME](https://github.com/jurliyuuri/linzklar-recognition/#readme)とか[別リポジトリにある教材](http://jurliyuuri.com/spoonfed_pekzep/index.html)とかで説明している。

## フォントの実演
[こちら](https://sozysozbot.github.io/geometric_linzklar/sample_y1huap1cet2kaikzui1.html)

## サイズ
各グリフは、(10, 10) から始まる縦100 x 横116の水色の中にギリギリ入るか、水色の外の枠線にほんの少々めり込むかぐらいでデザインする。枠線を含めた縦120 x 横136 をフルセルと呼ぶ。フルセルをそのまま縦に並べることで程よい字間が実現できるという設計になっている。
中心縦線は `<path d="m68 10v100z" />` である。左右対称な点のx座標を足し算すると 136 になるべきであることに注意。太さをバリアブルにする都合上、枠線に対して垂直な線はギリギリまで伸ばすが、横線は横枠線よりも11以上離して置くほうがいい。横の長い上線はだいたい `<path d="m20 21h96z" />` と書けばいい。

## 分割
`main.svg` に全部書いた後で `node split.js` を走らせると、`char_glyphs/` 下に各グリフのSVGと `content.txt` が並ぶはず。ファイル名とフォルダ名を指定して実行したいなら `node split.js main.svg char_glyphs` とする。

## 統合
逆に、 `node render.js` を走らせると、 `char_glyphs/` 下の各グリフのSVGと `content.txt` を読んで、一枚の `main.svg` を吐き出してくれる。ファイル名とフォルダ名を指定して実行したいなら `node render.js char_glyphs main.svg` とする。 `renderer_settings.json` で設定をいじることができる。

* `viewBox_max_x`: viewBox の x がどこで**終わる**かを指定。原稿用紙は左に延びていくので、 `max_x` を指定した方が便利。
* `viewBox_min_y`: viewBox の y がどこから始まるかを指定。
* `column_format`: `" **** **** **** "` のように書いて、どこにスペースを入れるかを指定。
* `outermost_border_color`: 各カラムの一番外の枠の色。
* `border_colors`: カラムの各セルの枠の色。ここだけはカラフルにできるので配列で指定。配列の長さは、column_format の文字数と一致している必要がある。
* `cell_inner_color`: 各セル内部の背景色。
* `column_spacing`: カラム間の間隔。

## コマンド

```
node split.js; node render.js
node split.js new_glyphs.svg new_glyphs; node render.js new_glyphs new_glyphs.svg
```

## 現状
 * 縦線
 * 横線
 * 半円
 * 四分円
 * 半楕円（横1:縦2）
 * 四分楕円（横1:縦2）
 * 半楕円（横2:縦1）
 * 四分楕円（横2:縦1）
 * 傾き±3
 * 傾き±2
 * 傾き±1/2
 * 傾き±1
 * 傾き±1/3

だけを使用。

## バイナリフォーマット
上記の要素のみを使っていることがわかりやすいように、上記のものだけをエンコードできるバイナリフォーマットを定めてある。仕様は [binary.md](https://github.com/sozysozbot/geometric_linzklar/blob/master/binary.md) に書いた。

## フォント化
1. `main.svg` に全部書く
2. `node split_noback.js` を走らせる。すると、`char_glyphs_without_borders/` 下に各グリフのSVGと `content.txt` が並ぶはず。
3. `node fix_glyphs.js` を走らせると `fixed_glyphs/` 下にストローク化したSVGが生成される（この処理はかなり重い）
4. `node to_font.js` を走らせると、`fonts/` 以下にフォントが生えるはず。

## TODO
以上のをもうMakefileかなんかにしてなんとかしろ

## お世話になったツール一覧

### SVG を手書きするのに役立ったツール
* Visual Studio Code
    - 最近はこれとNotepad++とメモ帳しか使ってない

* [jock.svg Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=jock.svg)
    - SVGをリアルタイムでプレビューできて便利
    - ただし、`<path d="...">` ってパターンを見つけるとなんでもシンタックスハイライトしようとしてくるので、テンプレート文字列とかであっても容赦なく色を塗ってくる点はちょっと不便。
![](https://github.com/sozysozbot/geometric_linzklar/blob/master/syntax_highlight.png)
* [SVGPathEditor](https://yqnn.github.io/svg-path-editor/)
    - SVGのパスデータを拡縮したり、平行移動したり、相対座標へ全変換したり、四捨五入したりできる。
    - 今回は「整数座標でのベタ書きしかできない」という縛りでやったので、transformとかをSVG内に残すことなくデータを完成させるのに本当にお世話になった。

### フォントを生成するのにお世話になったライブラリ
* [oslllo-svg-fixer](https://github.com/oslllo/svg-fixer)
    - ストロークで書かれたSVGをフィルに変換する。つまり、たとえば「太さ0.5で長さ10の直線」として指示されている描画を、「0.5×10の長方形の内部を塗りつぶしたもの」という指示へと変換してくれる。多くのフォント生成ツールは入力がフィルになっていることを前提としており、したがってこのツールで変換してやる必要があった。
    - ただまあ、このコードめちゃめちゃ遅いのよね。一般にベジエに対するフィル化がつらいのはわかるのだけれど、当リポジトリではベジエを使わず円・楕円・直線だけで書いてるので、それを決め打ちにすれば遥かに高速化できるはず。

* [fantasticon](https://github.com/tancredi/fantasticon)
    - ただし、なんか生成物のTypeScriptが2021年10月25日現在バグってる（出力コードポイントが漢字であることが原因だろうか？えーでもそうはならんくない？）ので、`assetTypes: [ OtherAssetType.CSS, OtherAssetType.HTML, OtherAssetType.JSON]` と指定して明確に TypeScript の生成を抑制してやる必要がある。 