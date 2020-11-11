#--------------------------------------------------------------------------
# ■ 速度逆転ステート ver.1.01 莞爾の草
#--------------------------------------------------------------------------
# 　特定のステートにかかると次のターンから遅いほうから
# 先に行動できるようになります。
# 　ステートのメモ欄に<順番逆転>と書くことで逆転させる
# ステートに指定できます。
#--------------------------------------------------------------------------
module BattleManager
  ODD_JUDGE = false
  # falseにすると、１人以上かかっていれば逆転させる。
  # true にすると、奇数人数かかっているときだけ逆転させる。
  #（「裏の裏の裏は裏、裏の裏は表」みたいな理屈）

  #--------------------------------------------------------------------------
  # ● 順番が逆転しているか
  #--------------------------------------------------------------------------
  def self.reversal_speed?
    size = 0
    ($game_party.battle_members + $game_troop.alive_members).each do |battler|
      battler.states.each do |state|
        size += 1 if state.note.include?("<順番逆転>")
      end
    end
    return ODD_JUDGE ? size.odd? : size > 0
  end
end

class Game_Action
  #--------------------------------------------------------------------------
  # ● 行動速度の計算 [再定義]
  #--------------------------------------------------------------------------
  alias trkr_speed speed
  def speed
    speed = trkr_speed
    if BattleManager.reversal_speed?
      speed -= subject.agi
      speed += (subject.param_max(6) - subject.agi)
    end
    return speed
  end
end
