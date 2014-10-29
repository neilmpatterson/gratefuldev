# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141029201654) do

  create_table "show_sets", id: false, force: true do |t|
    t.string  "uuid",                      null: false
    t.string  "show_uuid"
    t.integer "position"
    t.boolean "encore",    default: false
  end

  create_table "shows", id: false, force: true do |t|
    t.string  "uuid",     null: false
    t.integer "year"
    t.integer "month"
    t.integer "day"
    t.integer "position"
    t.string  "venue"
    t.string  "city"
    t.string  "state"
    t.string  "country"
  end

  add_index "shows", ["uuid", "year", "month", "day"], name: "index_shows_on_uuid_and_year_and_month_and_day"

  create_table "song_occurences", id: false, force: true do |t|
    t.string  "uuid",          null: false
    t.string  "show_uuid"
    t.string  "song_ref_uuid"
    t.integer "position"
  end

  add_index "song_occurences", ["uuid", "song_ref_uuid"], name: "index_song_occurences_on_uuid_and_song_ref_uuid"

  create_table "song_refs", id: false, force: true do |t|
    t.string  "uuid",                              null: false
    t.string  "name"
    t.string  "slug"
    t.integer "song_occurences_count", default: 0
  end

  add_index "song_refs", ["uuid", "name", "slug"], name: "index_song_refs_on_uuid_and_name_and_slug"

  create_table "songs", id: false, force: true do |t|
    t.string  "uuid",          null: false
    t.string  "show_set_uuid"
    t.string  "song_ref_uuid"
    t.integer "position"
    t.boolean "segued"
  end

  add_index "songs", ["uuid", "song_ref_uuid"], name: "index_songs_on_uuid_and_song_ref_uuid"

end
