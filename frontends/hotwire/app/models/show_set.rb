class ShowSet < ApplicationRecord
  self.primary_key = "uuid"

  belongs_to :show, foreign_key: :show_uuid, primary_key: :uuid
  has_many :songs, foreign_key: :show_set_uuid, primary_key: :uuid
end
