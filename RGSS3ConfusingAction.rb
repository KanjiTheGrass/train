#==============================================================================
# ■ RGSS3 混乱時行動拡張スクリプト ver.1.00a
#------------------------------------------------------------------------------
# 混乱時の行動パターンを変更します。全ての項目を上書きしているため
# 競合が起こりやすいですが悪しからず。
#
# 【更新履歴】
# ・ver.1.00　公開しました 
# ・ver.1.00a コミュ太郎氏により使用不能のスキルがあると
# 　まれに行動できなくなる不具合の修正とスクリプトの簡略化が行われました。
#==============================================================================
module ConfExte
  UseItem = true # 混乱時アクターが持っているアイテムを勝手に使うか。
                 # trueで使う、falseで使わない。

  UIRate = Rational('1/3') # 混乱時アイテムを使う確率(初期設定：1/3)

  TargetRandom = true  # 混乱時の行動対象（敵か味方か）をランダムにするか。
                       # trueでランダム、falseで固定。
  
  ChangeRate = Rational('2/3')  # TargetRandomがtrueの時、行動対象が狂う確率
                                # 1以上の値は入れないでください。
end

#==============================================================================
# ■ Game_Action
#------------------------------------------------------------------------------
# 　戦闘行動を扱うクラスです。このクラスは Game_Battler クラスの内部で使用され
# ます。
#==============================================================================

class Game_Action
  #--------------------------------------------------------------------------
  # ● 混乱行動を設定
  #--------------------------------------------------------------------------
  def set_confusion
    case rand <=> ConfExte::UIRate
    when -1
      if ConfExte::UseItem
        items = []
        $data_items.each do |i|
          next unless i
          items+=[i.id] if $game_party.has_item?(i,false) && $game_party.usable?(i)
        end
        items.empty? ? use_a_skill : set_item(items.sample)
      else
        use_a_skill
      end
    else
      use_a_skill
    end
  end
  #--------------------------------------------------------------------------
  # ● スキルを使う
  #--------------------------------------------------------------------------
  def use_a_skill
    skill = (subject.usable_skills+
    [$data_skills[subject.attack_skill_id]]).sample
    if skill
      if subject.skill_cost_payable?(skill)
        set_skill(skill.id)
      else
        set_attack
      end
    else
      set_attack
    end
  end
  #--------------------------------------------------------------------------
  # ● 行動準備
  #--------------------------------------------------------------------------
  def prepare
  end
  #--------------------------------------------------------------------------
  # ● 混乱時のターゲット
  #--------------------------------------------------------------------------
  def confusion_target
    a = rand
    a = 0 if !ConfExte::TargetRandom
    if item.for_opponent?
      a < ConfExte::ChangeRate ? friends_unit.random_target : opponents_unit.random_target
    elsif item.for_user?
      subject
    elsif item.for_friend?
      a < ConfExte::ChangeRate ? opponents_unit.random_target : friends_unit.random_target
    else
      []
    end
  end
end