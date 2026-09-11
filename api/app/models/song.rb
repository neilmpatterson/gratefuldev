class Song < ApplicationRecord
  self.primary_key = "uuid"

  belongs_to :show_set, foreign_key: :show_set_uuid, primary_key: :uuid
  belongs_to :song_ref, foreign_key: :song_ref_uuid, primary_key: :uuid
end
