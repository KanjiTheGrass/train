#==============================================================================
# �� RGSS3 �������s���g���X�N���v�g ver.1.00a
#------------------------------------------------------------------------------
# �������̍s���p�^�[����ύX���܂��B�S�Ă̍��ڂ��㏑�����Ă��邽��
# �������N����₷���ł����������炸�B
#
# �y�X�V�����z
# �Ever.1.00�@���J���܂��� 
# �Ever.1.00a �R�~�����Y���ɂ��g�p�s�\�̃X�L���������
# �@�܂�ɍs���ł��Ȃ��Ȃ�s��̏C���ƃX�N���v�g�̊ȗ������s���܂����B
#==============================================================================
module ConfExte
  UseItem = true # �������A�N�^�[�������Ă���A�C�e��������Ɏg�����B
                 # true�Ŏg���Afalse�Ŏg��Ȃ��B

  UIRate = Rational('1/3') # �������A�C�e�����g���m��(�����ݒ�F1/3)

  TargetRandom = true  # �������̍s���Ώہi�G���������j�������_���ɂ��邩�B
                       # true�Ń����_���Afalse�ŌŒ�B
  
  ChangeRate = Rational('2/3')  # TargetRandom��true�̎��A�s���Ώۂ������m��
                                # 1�ȏ�̒l�͓���Ȃ��ł��������B
end

#==============================================================================
# �� Game_Action
#------------------------------------------------------------------------------
# �@�퓬�s���������N���X�ł��B���̃N���X�� Game_Battler �N���X�̓����Ŏg�p����
# �܂��B
#==============================================================================

class Game_Action
  #--------------------------------------------------------------------------
  # �� �����s����ݒ�
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
  # �� �X�L�����g��
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
  # �� �s������
  #--------------------------------------------------------------------------
  def prepare
  end
  #--------------------------------------------------------------------------
  # �� �������̃^�[�Q�b�g
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