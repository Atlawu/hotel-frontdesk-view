-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('Standard', 'Deluxe', 'Suite', 'Penthouse')),
    status TEXT NOT NULL DEFAULT 'Vacant-Clean' CHECK (status IN ('Occupied', 'Vacant-Clean', 'Vacant-Dirty', 'Out-of-Order')),
    price_per_night NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    id_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
    check_in TIMESTAMP WITH TIME ZONE NOT NULL,
    check_out TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Confirmed' CHECK (status IN ('Confirmed', 'Checked-in', 'Checked-out', 'Cancelled')),
    total_price NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (allow all for now as it's a management system)
CREATE POLICY "Allow all for rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for guests" ON guests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_bookings_room_id ON bookings(room_id);
CREATE INDEX idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Seed initial rooms
INSERT INTO rooms (number, type, status, price_per_night) VALUES
('101', 'Standard', 'Vacant-Clean', 100),
('102', 'Standard', 'Occupied', 100),
('103', 'Standard', 'Vacant-Dirty', 100),
('201', 'Deluxe', 'Vacant-Clean', 200),
('202', 'Deluxe', 'Occupied', 200),
('203', 'Deluxe', 'Out-of-Order', 200),
('301', 'Suite', 'Vacant-Clean', 350),
('302', 'Suite', 'Occupied', 350),
('401', 'Penthouse', 'Vacant-Clean', 1000)
ON CONFLICT (number) DO NOTHING;