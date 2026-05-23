import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, username, email, password } = body;

    // Validate inputs
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: 'All fields (name, username, email, password) are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('wedding-planner');
    const usersCol = db.collection('users');

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Check if username or email already exists
    const existingUser = await usersCol.findOne({
      $or: [
        { username: cleanUsername },
        { email: cleanEmail }
      ]
    });

    if (existingUser) {
      if (existingUser.username === cleanUsername) {
        return NextResponse.json(
          { error: 'Username is already taken.' },
          { status: 400 }
        );
      }
      if (existingUser.email === cleanEmail) {
        return NextResponse.json(
          { error: 'Email is already registered.' },
          { status: 400 }
        );
      }
    }

    // Securely hash password using standard crypto Pbkdf2
    const hashedPassword = hashPassword(password);

    // Save the new user document
    const result = await usersCol.insertOne({
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      createdAt: new Date()
    });

    return NextResponse.json(
      {
        message: 'User registered successfully!',
        user: {
          id: result.insertedId.toString(),
          name: name.trim(),
          username: cleanUsername,
          email: cleanEmail
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration failed:', error);
    return NextResponse.json(
      { error: 'An unexpected database error occurred.' },
      { status: 500 }
    );
  }
}
