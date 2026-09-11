# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_09_11_204155) do
  create_table "show_sets", primary_key: "uuid", id: :string, force: :cascade do |t|
    t.string "show_uuid"
    t.integer "position"
    t.boolean "encore", default: false
  end

  create_table "shows", primary_key: "uuid", id: :string, force: :cascade do |t|
    t.integer "year"
    t.integer "month"
    t.integer "day"
    t.integer "position"
    t.string "venue"
    t.string "city"
    t.string "state"
    t.string "country"
    t.index ["uuid", "year", "month", "day"], name: "index_shows_on_uuid_and_year_and_month_and_day"
  end

  create_table "song_occurences", primary_key: "uuid", id: :string, force: :cascade do |t|
    t.string "show_uuid"
    t.string "song_ref_uuid"
    t.integer "position"
    t.index ["uuid", "song_ref_uuid"], name: "index_song_occurences_on_uuid_and_song_ref_uuid"
  end

  create_table "song_refs", primary_key: "uuid", id: :string, force: :cascade do |t|
    t.string "name"
    t.string "slug"
    t.integer "song_occurences_count", default: 0
    t.index ["uuid", "name", "slug"], name: "index_song_refs_on_uuid_and_name_and_slug"
  end

  create_table "songs", primary_key: "uuid", id: :string, force: :cascade do |t|
    t.string "show_set_uuid"
    t.string "song_ref_uuid"
    t.integer "position"
    t.boolean "segued"
    t.index ["uuid", "song_ref_uuid"], name: "index_songs_on_uuid_and_song_ref_uuid"
  end
end
