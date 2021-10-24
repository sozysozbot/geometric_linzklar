# geometric_linzklar

簡単な幾何学的図形だけで燐字をそこそこきれいに書きたい

![](https://github.com/sozysozbot/geometric_linzklar/blob/master/400.png)

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
* Visual Studio Code
* [jock.svg Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=jock.svg)
* [SVGPathEditor](https://yqnn.github.io/svg-path-editor/)
