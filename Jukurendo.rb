#==============================================================================
# ■ 武器熟練度システム by かんじの草
#==============================================================================
=begin

　　特定のスキルを使用すると装備している武器の熟練度が上がり、
　武器の性能が上がっていくようになるスクリプトです。

　　以下の文をスキルのメモ欄に張り付けることで、熟練度の
　上がるスキルを指定することができます。

　<熟練度スキル>

  　武器自体のレベルが上がるのではなく、アクターごとの
  武器熟練度が上がるので、例えば、エリックがナイフの
  武器熟練度をレベル５にしても、ナタリーがナイフを装備した
  ときはレベル１になります。

  　特に指定しなければ、次のレベルまでの必要熟練度は装備の
  パフォーマンス値（最強装備を決めるための内部的な数値）
  によって決められ、レベルアップによって上がるパラメーターは
  攻撃力で、２だけ上がるようになっていて、装備の最大レベルは
  ２５となっていますが、
  
　　下記の文を武器のメモ欄に書き込むことによって、
　熟練度の設定を調整することができます。
　
  <次のレベルまで:25>
 
  <上がるパラメーター:0, 2>

  　武器レベルアップで上がるパラメーターを変更できます。
  デフォルトでは攻撃力が上がります。
  :の後ろ一番目はパラメータのIDを指します。
    0 => HP
    1 => MP
    2 => 攻撃力
    3 => 防御力
    4 => 魔攻力
    5 => 魔防力
    6 => 敏捷性
    7 => 運
  二番目の数字はそのパラメーターの成長率を指し、例えば
  <上がるパラメーター:0, 2>だったら、「HPを2あげる」という
  ことになります。
  この文は一つの武器に複数使うことができるので、
  HPを２、攻撃力を３を上げる武器などをつくることもできます。
  
  
  <熟練度最大レベル:15>
  　熟練度の最大レベルです。デフォルトでは25です。

=end


module KS
  module Equip_Level
    
    Levelup_Anime = 37 
    #装備レベルが上がったときに出るアニメです。
    #nilを入れるとアニメは出ません。
    #デフォのツクールではアクターにはアニメは写りませんが……
    #フラッシュとSE用に使うといいかもしれません
    
    def self.next_levelup(item)
      return if item.nil? || item.id.zero?
      $data_weapons[item.id].note =~ /<次のレベルまで[:：](\d+)>/
      return $1 ? $1.to_i : nil
    end

    def self.up_params(item)
      return [] if item.nil? || item.id.zero?
      r = $data_weapons[item.id].note.scan(/<上がるパラメーター[:：](\d+),\s*(\d+)>/)
      return r.empty? ? [[2, 2]] : r.map {|k| k.map {|str| str.to_i } }
      #もし上がるパラメーターが設定されていなければ攻撃力が2上がる。
    end

    def self.max_level(item)
      return if item.nil? || item.id.zero?
      $data_weapons[item.id].note =~ /<熟練度最大レベル[:：](\d+)>/
      return $1 ? $1.to_i : nil
    end

  end
end

#==============================================================================
# ■ Game_BaseItem
#==============================================================================
class Game_BaseItem
  def id
    @item_id
  end
end



include KS
class Game_Actor
  #--------------------------------------------------------------------------
  # ● 通常能力値の取得
  #--------------------------------------------------------------------------
  alias jkns_param param
  def param(param_id)
    value  = jkns_param(param_id)
    add = atk_equip_plus(param_id)
    add *= param_rate(param_id) * param_buff_rate(param_id)
    value += add
    return [[value, param_max(param_id)].min, param_min(param_id)].max.to_i
  end
  #--------------------------------------------------------------------------
  # ● 武器熟練度追加分
  #--------------------------------------------------------------------------
  def equip_plus(item)
    return 0 if item.nil?
    @equip_plus ||= {}
    @equip_plus[item.id] ||= 0
    return @equip_plus[item.id]
  end
  #--------------------------------------------------------------------------
  # ● 武器熟練度を上げる
  #--------------------------------------------------------------------------
  def gain_equip_plus(item, value=1)
    return if equip_max_level?(item)
    equip_plus(item)
    return 0 if item.nil?
    @equip_plus[item.id] = [@equip_plus[item.id] + value, 
    equip_experience(item) * equip_max_level(item)].min
  end
  #--------------------------------------------------------------------------
  # ● 装備レベル
  #--------------------------------------------------------------------------
  def equip_level(item)
    equip_plus(item)
    return 0 if item.nil?
    return (@equip_plus[item.id] / equip_experience(item)).next
  end
  #--------------------------------------------------------------------------
  # ● 次の装備熟練度まで
  #--------------------------------------------------------------------------
  def equip_experience(item)
    if Equip_Level.next_levelup(item)
      Equip_Level.next_levelup(item)
    elsif wpn = $data_weapons[item.id]
      pfm = wpn.performance / 3
      pfm > experience_min ? pfm : experience_min
    else
      1
    end
  end
  #--------------------------------------------------------------------------
  # ● 熟練度EXP下限
  #--------------------------------------------------------------------------
  def experience_min
    return 1
  end
  #--------------------------------------------------------------------------
  # ● 装備最大熟練度
  #--------------------------------------------------------------------------
  def equip_max_level(item)
    return (Equip_Level.max_level(item) || 25) - 1
  end
  #--------------------------------------------------------------------------
  # ● レベルマックスか？
  #--------------------------------------------------------------------------
  def equip_max_level?(item)
    return true if item.nil?
    equip_plus(item)
    return @equip_plus[item.id] >= equip_experience(item) * equip_max_level(item)
  end
  #--------------------------------------------------------------------------
  # ● 追加する熟練度
  #--------------------------------------------------------------------------
  def atk_equip_plus(param_id=nil)
    plus_param = param_id ? 0 : Array.new(8, 0)

    equip_slots.each_with_index do |slot_id, index|
      next if slot_id.nonzero?
      Equip_Level.up_params(item = @equips[index]).each do |upprm|
        if param_id.nil? || param_id == upprm[0]
          calc = (equip_level(item) - 1) * upprm[1]
          if param_id
            plus_param += calc
          else
            plus_param[param_id] += calc
          end
        end
      end
    end
    return plus_param
  end
end

#==============================================================================
# ■ Scene_Battle
#==============================================================================

class Scene_Battle
  #--------------------------------------------------------------------------
  # ● スキル／アイテムの使用
  #--------------------------------------------------------------------------
  alias __equipplus_use_item use_item
  def use_item
    item = @subject.current_action.item
    __equipplus_use_item
    if @subject.actor? && item.is_a?(RPG::Skill) && 
      $data_skills[item.id].note.include?("<熟練度スキル>")
      levelup = false
      @subject.equip_slots.each_with_index do |slot_id, index|
        next if slot_id.nonzero?
        e = @subject.equips[index]
        last = @subject.equip_level(e)
        @subject.gain_equip_plus(e)
        levelup = last != @subject.equip_level(e) if levelup == false
      end
      if levelup
        @log_window.clear
        refresh_status
        anime = KS::Equip_Level::Levelup_Anime
        anime && show_normal_animation([@subject], anime)
        @log_window.display_equip_levelup(@subject)
      end
    end
  end
end



class Window_Base
  def draw_equip_plus_guage(actor, item, rect, width)
    reset_font_settings
    if actor.equip_max_level?(item)
      now = "-------"
      rate = max = 1 
    else
      max = actor.equip_experience(item)
      now = actor.equip_plus(item) % max
      rate = now.to_f / max
    end
    x = rect.x + rect.width - width - 2
    y = rect.y
    draw_gauge(x, y, width, rate, tp_gauge_color1, tp_gauge_color2)
    change_color(system_color)
    draw_equip_experience(rect, now, max, normal_color, normal_color)
  end
  def draw_equip_level(x, y, width, level)
    reset_font_settings
    contents.font.size = 15
    draw_text(x, y, width, contents.font.size, Vocab.level_a + level.to_s, 2)
    reset_font_settings
  end
  #--------------------------------------------------------------------------
  # ● 現在値／最大値を分数形式で描画
  #--------------------------------------------------------------------------
  def draw_equip_experience(rect, current, max, color1, color2)
    x = rect.x + rect.width - 42
    y = rect.y + 8
    reset_font_settings
    contents.font.size = 16
    draw_text(x-30, y, 42, contents.font.size, current, 2)
    draw_text(x+8 , y, 12, contents.font.size, "/", 2)
    draw_text(x   , y, 42, contents.font.size, max, 2)
    reset_font_settings
  end
end

#==============================================================================
# ■ Window_EquipSlot
#==============================================================================

class Window_EquipSlot
  #--------------------------------------------------------------------------
  # ● 項目の描画
  #--------------------------------------------------------------------------
  alias kkk_draw_item draw_item
  def draw_item(index)
    return unless @actor
    rect = item_rect(index)
    if @actor.equip_slots[index].zero? && equip = @actor.equips[index]
      draw_equip_plus_guage(@actor, equip, rect, 72)
      draw_equip_level(rect.x, rect.y-2, rect.width, @actor.equip_level(equip))
    end
    kkk_draw_item(index)
  end
end

#==============================================================================
# ■ Window_EquipItem
#==============================================================================
class Window_EquipItem
  #--------------------------------------------------------------------------
  # ● 行の高さを取得
  #--------------------------------------------------------------------------
  def item_height
    return 32
  end
  #--------------------------------------------------------------------------
  # ● 項目の描画
  #--------------------------------------------------------------------------
  alias kkk_draw_item draw_item
  def draw_item(index)
    if item = @data[index]
      rect = item_rect(index)
      if item.class == RPG::Weapon
        rect.y += 9

        width = 72
        rect.x -= 4
        draw_equip_plus_guage(@actor, item, rect, width)
        rect.x += 4
        draw_equip_level(rect.x - width - 12, rect.y + 9, 
        rect.width, @actor.equip_level(item))
        rect.width -= 4
        rect.y -= 9
      end
      draw_item_name(item, rect.x, rect.y, enable?(item))
      rect.y -= 3
      draw_item_number(rect, item)
    end
  end
end

#==============================================================================
# ■ Window_BattleLog
#==============================================================================

class Window_BattleLog
  #--------------------------------------------------------------------------
  # ● 武器レベルアップの表示
  #--------------------------------------------------------------------------
  def display_equip_levelup(subject)
    add_text(sprintf("%sの武器レベルが上がった！", subject.name))
    wait
  end
end