-- Upgrade user to Premium subscription
-- Run this in Supabase SQL Editor after the user signs up

-- Step 1: Find the user by email
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Get user ID from auth.users
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = 'sample3@gmail.com';
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email sample3@gmail.com not found. Please sign up first.';
    END IF;
    
    -- Step 2: Create or update subscription to premium
    INSERT INTO public.user_subscriptions (
        user_id,
        plan,
        status,
        stripe_customer_id,
        stripe_subscription_id,
        current_period_start,
        current_period_end,
        cancel_at_period_end
    )
    VALUES (
        target_user_id,
        'premium',  -- Change to 'pro' if you prefer Pro instead
        'active',
        'manual_upgrade_' || target_user_id::text,  -- Placeholder
        'manual_sub_' || target_user_id::text,  -- Placeholder
        NOW(),
        NOW() + INTERVAL '1 year',  -- 1 year subscription
        false
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
        plan = 'premium',
        status = 'active',
        current_period_start = NOW(),
        current_period_end = NOW() + INTERVAL '1 year',
        cancel_at_period_end = false,
        updated_at = NOW();
    
    RAISE NOTICE 'User % upgraded to premium successfully!', target_user_id;
END $$;

-- Verify the subscription was created
SELECT 
    u.email,
    us.plan,
    us.status,
    us.current_period_end
FROM auth.users u
JOIN public.user_subscriptions us ON u.id = us.user_id
WHERE u.email = 'sample3@gmail.com';

