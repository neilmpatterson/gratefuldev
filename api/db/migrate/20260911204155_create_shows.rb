class CreateShows < ActiveRecord::Migration[8.0]
  def change
    create_table :shows, id: false do |t|
      t.string :uuid, null: false, primary_key: true
      t.integer :year
      t.integer :month
      t.integer :day
      t.integer :position
      t.string :venue
      t.string :city
      t.string :state
      t.string :country
    end
    add_index :shows, [:uuid, :year, :month, :day]

    create_table :show_sets, id: false do |t|
      t.string :uuid, null: false, primary_key: true
      t.string :show_uuid
      t.integer :position
      t.boolean :encore, default: false
    end

    create_table :song_refs, id: false do |t|
      t.string :uuid, null: false, primary_key: true
      t.string :name
      t.string :slug
      t.integer :song_occurences_count, default: 0
    end
    add_index :song_refs, [:uuid, :name, :slug]

    create_table :songs, id: false do |t|
      t.string :uuid, null: false, primary_key: true
      t.string :show_set_uuid
      t.string :song_ref_uuid
      t.integer :position
      t.boolean :segued
    end
    add_index :songs, [:uuid, :song_ref_uuid]

    create_table :song_occurences, id: false do |t|
      t.string :uuid, null: false, primary_key: true
      t.string :show_uuid
      t.string :song_ref_uuid
      t.integer :position
    end
    add_index :song_occurences, [:uuid, :song_ref_uuid]
  end
end
