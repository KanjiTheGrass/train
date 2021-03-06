#==============================================================================
# ■ RGSS3 技の対象変更 ver.1.13
#------------------------------------------------------------------------------
# 技の対象を自由に変更できるスクリプトです。
#
# 【更新履歴】
# ・ver.1.00　公開しました 
# ・ver.1.10　一部スキルでの対象変更を禁止できるようにしました。 
# ・ver.1.11　一度対象変化できるスキルを使おうとすると、次の対象変化禁止の
# 　　　　　　スキルでも対象変化できてしまうバグを修正。
# ・ver.1.12　戦闘開始時にスキルを選んでも正常に対象変化が行われない
#             バグを修正。
# ・ver.1.13　敵全体スキルを味方対象にしたときに味方単体にしか攻撃しない
# 　        　仕様を変更しました。
#==============================================================================
module KanjiExtendTarget
  #アイテム・スキルのメモ欄に<対象変化禁止>と書くと対象変更を禁止にできます。
  Ban="<対象変化禁止>"
  
  SWITCH_KEY1 = :pageup
  SWITCH_KEY2 = :pagedown
  
  #--------------------------------------------------------------------------
  # ● 対象変更が禁止されているか
  #--------------------------------------------------------------------------
  def self.banned?(item)
    return item.nil? || item.note.include?(Ban) 
  end
end

class Game_Action
  attr_accessor :a_or_e             # Actor or Enemy
  #--------------------------------------------------------------------------
  # ● オブジェクト初期化（再定義）
  #--------------------------------------------------------------------------
  alias kanji_initialize initialize
  def initialize(subject, forcing = false)
    @a_or_e = ""
    kanji_initialize(subject, forcing = false)
  end
  #--------------------------------------------------------------------------
  # ● ターゲットの配列作成（上書き）
  #--------------------------------------------------------------------------
  def make_targets
    if @a_or_e == "a"
      targets_for_friends
    elsif @a_or_e == "e"
      targets_for_opponents
      else
      if !forcing && subject.confusion?
        [confusion_target]
      elsif item.for_opponent?
        targets_for_opponents
      elsif item.for_friend?
        targets_for_friends
      else
        []
      end
    end
  end
  #--------------------------------------------------------------------------
  # ● 敵に対するターゲット（上書き）
  #--------------------------------------------------------------------------
  def targets_for_opponents
    if item.for_random?
      Array.new(item.number_of_targets) { opponents_unit.random_target }
    elsif item.for_dead_friend?
      if item.for_all?
        opponents_unit.dead_members
      else
        [opponents_unit.smooth_dead_target(@target_index)]
      end
    elsif item.for_one?
      num = (attack? ? subject.atk_times_add.to_i : 0).next
      if @target_index < 0
        [opponents_unit.random_target] * num
      else
        [opponents_unit.smooth_target(@target_index)] * num
      end
    else
      opponents_unit.alive_members
    end
  end
  #--------------------------------------------------------------------------
  # ● 味方に対するターゲット（上書き）
  #--------------------------------------------------------------------------
  def targets_for_friends
    if item.for_user?
      [subject]
    elsif item.for_dead_friend?
      if item.for_one?
        [friends_unit.smooth_dead_target(@target_index)]
      else
        friends_unit.dead_members
      end
    else
      if item.for_one?
        [friends_unit.smooth_target(@target_index)]
      else
        friends_unit.alive_members
      end
    end
  end
end

#==============================================================================
# ■ Window_Selectable
#------------------------------------------------------------------------------
# 　カーソルの移動やスクロールの機能を持つウィンドウクラスです。
#==============================================================================

class Window_Selectable < Window_Base
  #--------------------------------------------------------------------------
  # ● ハンドラの削除（追加）
  #--------------------------------------------------------------------------
  def undo_handler(symbol)
    @handler.delete(symbol)  if @handler[symbol]
  end
end

#==============================================================================
# ■ Scene_Battle
#------------------------------------------------------------------------------
# 　バトル画面の処理を行うクラスです。
#==============================================================================

class Scene_Battle < Scene_Base
  #--------------------------------------------------------------------------
  # ● スキル［決定］（再定義）
  #--------------------------------------------------------------------------
  alias kanji_on_skill_ok on_skill_ok
  def on_skill_ok
    @item = @skill_window.item
    kanji_on_skill_ok 
  end
  #--------------------------------------------------------------------------
  # ● コマンド［攻撃］（再定義）
  #--------------------------------------------------------------------------
  alias kanji_command_attack command_attack
  def command_attack
    @item = $data_skills[BattleManager.actor.attack_skill_id]
    kanji_command_attack
  end
  #--------------------------------------------------------------------------
  # ● アクターウィンドウの作成（再定義）
  #--------------------------------------------------------------------------
  alias kanji_create_actor_window create_actor_window
  def create_actor_window
    kanji_create_actor_window
  end
  #--------------------------------------------------------------------------
  # ● 敵キャラウィンドウの作成（再定義）
  #--------------------------------------------------------------------------
  alias kanji_create_enemy_window create_enemy_window
  def create_enemy_window
    kanji_create_enemy_window
  end
  #--------------------------------------------------------------------------
  # ● アクター選択の開始（再定義）
  #--------------------------------------------------------------------------
  alias kanji_select_actor_selection select_actor_selection
  def select_actor_selection
    changeable
    kanji_select_actor_selection
  end
  #--------------------------------------------------------------------------
  # ● 敵キャラ選択の開始（再定義）
  #--------------------------------------------------------------------------
  alias kanji_select_enemy_selection select_enemy_selection
  def select_enemy_selection
    changeable
    kanji_select_enemy_selection
  end
  #--------------------------------------------------------------------------
  # ● アクターウィンドウから切り替えられる
  #--------------------------------------------------------------------------
  def changeable
    unless KanjiExtendTarget.banned?(@item)
      @actor_window.set_handler(KanjiExtendTarget::SWITCH_KEY1,method(:to_enemy_window))
      @actor_window.set_handler(KanjiExtendTarget::SWITCH_KEY2,method(:to_enemy_window))
      @enemy_window.set_handler(KanjiExtendTarget::SWITCH_KEY1,method(:to_actor_window))
      @enemy_window.set_handler(KanjiExtendTarget::SWITCH_KEY2,method(:to_actor_window))
    else
      @actor_window.undo_handler(KanjiExtendTarget::SWITCH_KEY1)
      @actor_window.undo_handler(KanjiExtendTarget::SWITCH_KEY2)
      @enemy_window.undo_handler(KanjiExtendTarget::SWITCH_KEY1)
      @enemy_window.undo_handler(KanjiExtendTarget::SWITCH_KEY2)
    end
  end
  #--------------------------------------------------------------------------
  # ● アクターウィンドウに移動（追加）
  #--------------------------------------------------------------------------
  def to_actor_window
    @enemy_window.hide
    @actor_window.refresh
    Input.update
    @actor_window.show.activate
  end
  #--------------------------------------------------------------------------
  # ● エネミーウィンドウに移動（追加）
  #--------------------------------------------------------------------------
  def to_enemy_window
    @actor_window.hide
    @enemy_window.refresh
    Input.update
    @enemy_window.show.activate
  end
  #--------------------------------------------------------------------------
  # ● アクター［決定］（再定義）
  #--------------------------------------------------------------------------
  alias kanji_on_actor_ok on_actor_ok
  def on_actor_ok
    BattleManager.actor.input.a_or_e = "a"
    kanji_on_actor_ok
  end
  #--------------------------------------------------------------------------
  # ● 敵キャラ［決定］（再定義）
  #--------------------------------------------------------------------------
  alias kanji_on_enemy_ok on_enemy_ok
  def on_enemy_ok
    BattleManager.actor.input.a_or_e = "e"
    kanji_on_enemy_ok
  end
  #--------------------------------------------------------------------------
  # ● アクター［キャンセル］（上書き）
  #--------------------------------------------------------------------------
  def on_actor_cancel
    @actor_window.hide
    @enemy_window.hide
    case @actor_command_window.current_symbol
    when :attack 
      @actor_command_window.activate
    when :skill
      @skill_window.activate
    when :item
      @item_window.activate
    end
  end
  #--------------------------------------------------------------------------
  # ● 敵キャラ［キャンセル］（上書き）
  #--------------------------------------------------------------------------
  def on_enemy_cancel
    @actor_window.hide
    @enemy_window.hide
    case @actor_command_window.current_symbol
    when :attack 
      @actor_command_window.activate
    when :skill
      @skill_window.activate
    when :item
      @item_window.activate
    end
  end
end