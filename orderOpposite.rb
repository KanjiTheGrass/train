#--------------------------------------------------------------------------
# �� ���x�t�]�X�e�[�g ver.1.01 �Ύ��̑�
#--------------------------------------------------------------------------
# �@����̃X�e�[�g�ɂ�����Ǝ��̃^�[������x���ق�����
# ��ɍs���ł���悤�ɂȂ�܂��B
# �@�X�e�[�g�̃�������<���ԋt�]>�Ə������Ƃŋt�]������
# �X�e�[�g�Ɏw��ł��܂��B
#--------------------------------------------------------------------------
module BattleManager
  ODD_JUDGE = false
  # false�ɂ���ƁA�P�l�ȏォ�����Ă���΋t�]������B
  # true �ɂ���ƁA��l���������Ă���Ƃ������t�]������B
  #�i�u���̗��̗��͗��A���̗��͕\�v�݂����ȗ����j

  #--------------------------------------------------------------------------
  # �� ���Ԃ��t�]���Ă��邩
  #--------------------------------------------------------------------------
  def self.reversal_speed?
    size = 0
    ($game_party.battle_members + $game_troop.alive_members).each do |battler|
      battler.states.each do |state|
        size += 1 if state.note.include?("<���ԋt�]>")
      end
    end
    return ODD_JUDGE ? size.odd? : size > 0
  end
end

class Game_Action
  #--------------------------------------------------------------------------
  # �� �s�����x�̌v�Z [�Ē�`]
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
