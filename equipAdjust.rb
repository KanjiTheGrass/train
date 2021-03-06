﻿#==============================================================================
# ■ スペース調整 by 莞爾の草
#==============================================================================
# 装備欄＋αのスペース数を調整します
#==============================================================================

class Window_ItemList
  #--------------------------------------------------------------------------
  # ● アイテムリストの作成
  #--------------------------------------------------------------------------
  alias __item_space_make_item_list make_item_list
  def make_item_list
    __item_space_make_item_list
    if include?(nil) && col_max > 1
      nil_size = item_max % col_max
      nil_size = col_max if nil_size.zero?
      nil_size.times { @data.push(nil) }
    end
  end
end
