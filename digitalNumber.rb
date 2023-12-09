#==============================================================================
# �� �f�W�^���^�C�}�[ ver 1.00 �Ύ��̑�
#==============================================================================
# �@�^�C�}�[�̕������f�W�^�����v���̂��̂ɒu�����܂��B
# Graphics/System�̒���digitalNum�Ƃ������O�̉摜�ipng/jpg/jpeg�j�`����
# �摜�𕶎��ՂƂ��Ďg���܂��B
# �@�����Ղ̉摜�͓��p�Łu0123456789:�v�Ƃ������Ԃŕ`���Ă��������B
# �ꕶ���̕��͐����ł��邱�ƈȊO�w��͂���܂���B
#==============================================================================
class Sprite_Timer
  #--------------------------------------------------------------------------
  # �� �^�C�}�[�̕�����
  #--------------------------------------------------------------------------
  def timer_length
    return 5
  end
  #--------------------------------------------------------------------------
  # �� �r�b�g�}�b�v�̍쐬
  #--------------------------------------------------------------------------
  def create_bitmap
    @digital_bitmap = Cache.system("digitalNum")
    @diginum_width = @digital_bitmap.width / 11
    self.bitmap = Bitmap.new(@diginum_width * timer_length, @digital_bitmap.height)
  end
  #--------------------------------------------------------------------------
  # �� �ĕ`��
  #--------------------------------------------------------------------------
  def redraw
    self.bitmap.clear
    text = timer_text
    rect = Rect.new(0, 0, @diginum_width, @digital_bitmap.height)
    timer_length.times do |i|
      rect.x = (text[i] == ?: ? 10 : text[i].to_i) * @diginum_width
      self.bitmap.blt(@diginum_width * i, 0, @digital_bitmap, rect)
    end
  end
  #--------------------------------------------------------------------------
  # �� �ʒu�̍X�V
  #--------------------------------------------------------------------------
  def update_position
    self.x = Graphics.width - self.bitmap.width - 8
    self.y = 5
    self.z = 200
  end
  #--------------------------------------------------------------------------
  # �� ���
  #--------------------------------------------------------------------------
  alias digtimer_dispose dispose
  def dispose
    @digital_bitmap.dispose
    digtimer_dispose
  end
end
