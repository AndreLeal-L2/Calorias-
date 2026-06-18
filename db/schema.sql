create table if not exists meals (
  id bigserial primary key,
  name text not null,
  calories integer not null check (calories > 0 and calories <= 6000),
  eaten_at timestamptz not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists meals_eaten_at_idx on meals (eaten_at desc);

create table if not exists training_sessions (
  id bigserial primary key,
  type text not null check (type in ('gym', 'bike', 'treadmill')),
  duration_minutes integer not null check (duration_minutes > 0 and duration_minutes <= 600),
  intensity text,
  performed_at timestamptz not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists training_sessions_performed_at_idx
  on training_sessions (performed_at desc);

create table if not exists body_weights (
  id bigserial primary key,
  weight_kg numeric(5, 2) not null check (weight_kg >= 30 and weight_kg <= 300),
  measured_at date not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists body_weights_measured_at_idx
  on body_weights (measured_at desc);

create table if not exists settings (
  id integer primary key default 1 check (id = 1),
  daily_calorie_target integer not null default 1900 check (
    daily_calorie_target >= 1000 and daily_calorie_target <= 5000
  ),
  weekly_gym_target integer not null default 3 check (
    weekly_gym_target >= 0 and weekly_gym_target <= 7
  ),
  daily_cardio_target_minutes integer not null default 20 check (
    daily_cardio_target_minutes >= 0 and daily_cardio_target_minutes <= 240
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
