class SongRef < ApplicationRecord
  self.primary_key = "uuid"

  has_many :songs, foreign_key: :song_ref_uuid, primary_key: :uuid
  has_many :song_occurences, foreign_key: :song_ref_uuid, primary_key: :uuid

  scope :search, ->(q) { where("name LIKE ?", "%#{q}%") if q.present? }
end
