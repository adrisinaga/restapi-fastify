import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promisify } from 'util';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new sqlite3.Database(join(__dirname, '../data.db'));

// Promisify database methods
const run = promisify(db.run.bind(db));
const all = promisify(db.all.bind(db));
const get = promisify(db.get.bind(db));

// Initialize database
await run(`
  CREATE TABLE IF NOT EXISTS dog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    location TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export class DogDatabase {
  async create(data) {
    const result = await run(
      `INSERT INTO dog_posts (title, description, image, location)
       VALUES (?, ?, ?, ?)`,
      [data.title, data.description, data.image, data.location]
    );
    return this.findById(result.id);
  }

  async findAll() {
    return await all('SELECT * FROM dog_posts ORDER BY created_at DESC');
  }

  async findById(id) {
    return await get('SELECT * FROM dog_posts WHERE id = ?', [id]);
  }

  async update(id, data) {
    await run(
      `UPDATE dog_posts 
       SET title = ?, 
           description = ?, 
           image = ?, 
           location = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [data.title, data.description, data.image, data.location, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    return await run('DELETE FROM dog_posts WHERE id = ?', [id]);
  }

  async seed() {
    const dummyPosts = [
      {
        title: "Max the Golden Retriever",
        description: "Meet Max, my friendly 3-year-old Golden who loves swimming!",
        image: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24",
        location: "Seattle, WA"
      },
      {
        title: "Luna the Husky",
        description: "Luna enjoying her morning walk in the snow. She's 2 years old.",
        image: "https://images.unsplash.com/photo-1617895153857-82fe79adfcd4",
        location: "Denver, CO"
      },
      {
        title: "Charlie the Pug",
        description: "My adorable Pug Charlie showing off his new bow tie!",
        image: "https://images.unsplash.com/photo-1517849845537-4d257902454a",
        location: "Miami, FL"
      },
      {
        title: "Bella the German Shepherd",
        description: "Bella just graduated from police dog training! So proud!",
        image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95",
        location: "Chicago, IL"
      },
      {
        title: "Cooper the Labrador",
        description: "Cooper's first day at the beach. He loves the waves!",
        image: "https://images.unsplash.com/photo-1579213838058-c27e7a4e3c84",
        location: "San Diego, CA"
      },
      {
        title: "Daisy the Corgi",
        description: "Daisy showing off her new summer haircut!",
        image: "https://images.unsplash.com/photo-1612536057832-2ff7ead58194",
        location: "Portland, OR"
      },
      {
        title: "Rocky the Rottweiler",
        description: "Rocky's 5th birthday celebration with his favorite toy",
        image: "https://images.unsplash.com/photo-1567752881298-894bb81f9379",
        location: "Austin, TX"
      },
      {
        title: "Milo the Beagle",
        description: "Caught Milo napping in his favorite sunny spot",
        image: "https://images.unsplash.com/photo-1505628346881-b72b27e84530",
        location: "Boston, MA"
      },
      {
        title: "Sophie the Poodle",
        description: "Sophie won first place at the local dog show!",
        image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b",
        location: "New York, NY"
      },
      {
        title: "Oliver the Dachshund",
        description: "Oliver's first time playing in autumn leaves",
        image: "https://images.unsplash.com/photo-1612195583950-b8fd34c87093",
        location: "Nashville, TN"
      }
    ];

    for (const post of dummyPosts) {
      await this.create(post);
    }
  }
}

export const dogDb = new DogDatabase();