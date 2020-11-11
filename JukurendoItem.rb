#==============================================================================
# ■ 熟練度アップアイテム ver.1.00 by 莞爾の草
#------------------------------------------------------------------------------
# 　　武器熟練度を上げるアイテムを作れるようになるスクリプトです。
# 　　このスクリプトを使うには、莞爾の草作の装備熟練度スクリプトが
# 　必要となります。
#
# 【装備熟練度スクリプトのリンク】
# 　http://kanjinokusargss3.hatenablog.com/entry/2018/04/19/064200
#==============================================================================

class Scene_Item
  def jukurendo_check
    item.note =~ /<熟練度アップ\s?[:：]\s?(\d*)>/
    #アイテムのメモ欄に<熟練度アップ：n>と書くことでそのアイテムを
    #熟練度アップアイテムにすることができます（nには自然数を）。
    return $1 ? $1.to_i : nil
  end
  #--------------------------------------------------------------------------
  # ● 開始処理
  #--------------------------------------------------------------------------
  alias kns_start start
  def start
    kns_start
    create_equip_detail_window
  end
  #--------------------------------------------------------------------------
  # ● 装備詳細ウィンドウの作成
  #--------------------------------------------------------------------------
  def create_equip_detail_window
    @equip_item_window = Window_WeaponItem.new
    @equip_item_window.set_handler(:ok,     method(:gain_jukurendo))
    @equip_item_window.set_handler(:cancel, method(:return_weapon))
  end
  #--------------------------------------------------------------------------
  # ● アイテム［決定］
  #--------------------------------------------------------------------------
  def on_item_ok
    $game_party.last_item.object = item
    if jukurendo_check
      @equip_item_window.refresh
      show_sub_window(@equip_item_window)
    else
      determine_item
    end
  end
  def gain_jukurendo
    Sound.play_use_item
    last_item = item
    actor = @equip_item_window.actor
    actor.gain_equip_plus(actor.equips[@equip_item_window.index % 2], 
    jukurendo_check)
    $game_party.lose_item(last_item, 1)
    @item_window.refresh
    @equip_item_window.refresh
    @equip_item_window.activate
    return_weapon if $game_party.item_number(last_item) <= 0
  end
  def return_weapon
    hide_sub_window(@equip_item_window)
    @item_window.activate
  end
end


class Window_WeaponItem < Window_Selectable
  #--------------------------------------------------------------------------
  # ● オブジェクト初期化
  #--------------------------------------------------------------------------
  def initialize
    super(0,0, window_width, window_height)
    self.z = 1200
    self.visible = false
    select(0)
  end
  #--------------------------------------------------------------------------
  # ● 桁数の取得
  #--------------------------------------------------------------------------
  def col_max
    return 1
  end
  #--------------------------------------------------------------------------
  # ● ウィンドウの横幅
  #--------------------------------------------------------------------------
  def window_width
    Graphics.width - 160
  end
  #--------------------------------------------------------------------------
  # ● ウィンドウの縦幅
  #--------------------------------------------------------------------------
  def window_height
    Graphics.height
  end
  #--------------------------------------------------------------------------
  # ● パーティの取得
  #--------------------------------------------------------------------------
  def party
    $game_party.all_members
  end
  #--------------------------------------------------------------------------
  # ● 選択中のアクターの取得
  #--------------------------------------------------------------------------
  def actor
    party[index / 2]
  end
  #--------------------------------------------------------------------------
  # ● ウィンドウ内容の高さを計算
  #--------------------------------------------------------------------------
  def contents_height
    actor_height * party.size
  end
  def actor_height
    return 96
  end
  #--------------------------------------------------------------------------
  # ● 行の高さを取得
  #--------------------------------------------------------------------------
  def item_height
    return 36
  end
  #--------------------------------------------------------------------------
  # ● 1 ページに表示できる行数の取得
  #--------------------------------------------------------------------------
  def page_row_max
    ((height - standard_padding * 2) / actor_height.to_f).to_i * 2 - 3
  end
  #--------------------------------------------------------------------------
  # ● 選択項目の有効状態を取得
  #--------------------------------------------------------------------------
  def current_item_enabled?
    enable?(index, actor)
  end
  #--------------------------------------------------------------------------
  # ● リフレッシュ
  #--------------------------------------------------------------------------
  def refresh
    make_item_list
    create_contents
    draw_all_items
  end
  #--------------------------------------------------------------------------
  # ● 項目を描画する矩形の取得
  #--------------------------------------------------------------------------
  def item_rect(index)
    x = 100
    y = actor_height * (index / 2) + 24
    y += item_height * (index % 2)
    width = item_width - x
    height = item_height
    Rect.new(x, y, width, height)
  end
  #--------------------------------------------------------------------------
  # ● アイテムの取得
  #--------------------------------------------------------------------------
  def item
    @data && index >= 0 ? @data[index] : nil
  end
  #--------------------------------------------------------------------------
  # ● 項目数の取得
  #--------------------------------------------------------------------------
  def item_max
    return party.size * 2
  end
  #--------------------------------------------------------------------------
  # ● アイテムリストの作成
  #--------------------------------------------------------------------------
  def make_item_list
    @data = []
    party.each {|actor| @data.push(*actor.equips[0..1]) }
  end
  #--------------------------------------------------------------------------
  # ● 項目の描画
  #--------------------------------------------------------------------------
  def draw_item(index)
    actor = party[index / 2]
    rect = item_rect(index)
    if index.even?
      y = rect.y - 26
      draw_actor_face(actor, rect.x - 100, y)
      draw_actor_name(actor, rect.x, y)
      draw_actor_level(actor, window_width - 84, y)
      color = system_color
      color.alpha = 0
      contents.gradient_fill_rect(rect.x, y + 24, 128, 2, system_color, color)
    end

    rect.height = 24
    enable = enable?(index, actor)
    change_color(system_color, enable)
    draw_text(rect, Vocab.etype(index % 2))

    if item = @data[index]
      rect.x += 64
      if item.is_a?(RPG::Weapon)
        x = rect.x
        y = rect.y
        rect.x -= 68
        rect.y += 10
        draw_equip_plus_guage(actor, item, rect, 96)
        rect.x -= 32
        rect.y += 9
        contents.font.size = 16
        draw_equip_level(rect.x, rect.y, rect.width - 68, actor.equip_level(item))
        rect.x = x
        rect.y = y
      end
      reset_font_settings
      draw_item_name(item, rect.x, rect.y, enable)
    end
  end
  #--------------------------------------------------------------------------
  # ● 装備スロットを許可状態で表示するかどうか
  #--------------------------------------------------------------------------
  def enable?(index, actor)
    (item = @data[index]).is_a?(RPG::Weapon) && !actor.equip_max_level?(item)
  end
end