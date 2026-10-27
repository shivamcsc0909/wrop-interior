<?php
/**
 * WROP Interior Database Setup & Migrator
 * Supports both MySQL (production on Hostinger) and SQLite (instant local development).
 */

declare(strict_types=1);

require_once __DIR__ . '/../api/config/database.php';

echo "=== WROP Interior Database Initialization ===\n";

try {
    $db = getDatabaseConnection();
    $driver = $db->getAttribute(PDO::ATTR_DRIVER_NAME);
    echo "Connected using driver: [{$driver}]\n";

    if ($driver === 'sqlite') {
        echo "Configuring SQLite database schema...\n";
        
        $db->exec("
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(64) NOT NULL UNIQUE,
                email VARCHAR(128) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(32) NOT NULL,
                full_name VARCHAR(128) NOT NULL,
                is_active INTEGER NOT NULL DEFAULT 1,
                last_login_at DATETIME NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS sessions (
                id VARCHAR(128) PRIMARY KEY,
                user_id INTEGER NOT NULL,
                ip_address VARCHAR(45) NOT NULL,
                user_agent TEXT NOT NULL,
                payload TEXT NULL,
                last_activity INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS site_settings (
                key VARCHAR(64) PRIMARY KEY,
                value TEXT NOT NULL,
                type VARCHAR(32) DEFAULT 'string',
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS homepage_sections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                section_key VARCHAR(64) NOT NULL UNIQUE,
                title VARCHAR(255) NOT NULL,
                subtitle VARCHAR(255) NULL,
                content TEXT NULL,
                settings_json TEXT NULL,
                sort_order INTEGER DEFAULT 0,
                is_visible INTEGER DEFAULT 1,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS services (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR(128) NOT NULL,
                slug VARCHAR(128) NOT NULL UNIQUE,
                category VARCHAR(64) NOT NULL,
                short_description TEXT NOT NULL,
                full_description TEXT NOT NULL,
                featured_image VARCHAR(255) NOT NULL,
                features_json TEXT NULL,
                sort_order INTEGER DEFAULT 0,
                is_published INTEGER DEFAULT 1,
                seo_title VARCHAR(180) NULL,
                seo_description VARCHAR(255) NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR(128) NOT NULL,
                slug VARCHAR(128) NOT NULL UNIQUE,
                category VARCHAR(64) NOT NULL,
                location VARCHAR(128) NULL,
                is_demo INTEGER DEFAULT 1,
                short_description TEXT NOT NULL,
                full_description TEXT NOT NULL,
                concept TEXT NULL,
                materials_finishes TEXT NULL,
                scope TEXT NULL,
                featured_image VARCHAR(255) NOT NULL,
                gallery_json TEXT NULL,
                is_featured INTEGER DEFAULT 0,
                sort_order INTEGER DEFAULT 0,
                is_published INTEGER DEFAULT 1,
                seo_title VARCHAR(180) NULL,
                seo_description VARCHAR(255) NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS journal_articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR(180) NOT NULL,
                slug VARCHAR(180) NOT NULL UNIQUE,
                category VARCHAR(64) NOT NULL,
                excerpt TEXT NOT NULL,
                content TEXT NOT NULL,
                featured_image VARCHAR(255) NOT NULL,
                read_time VARCHAR(32) DEFAULT '5 min read',
                is_published INTEGER DEFAULT 1,
                published_at DATETIME NULL,
                seo_title VARCHAR(180) NULL,
                seo_description VARCHAR(255) NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS enquiries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(128) NOT NULL,
                email VARCHAR(128) NOT NULL,
                phone VARCHAR(64) NOT NULL,
                project_type VARCHAR(64) NOT NULL,
                property_type VARCHAR(64) NOT NULL,
                approx_area VARCHAR(64) NULL,
                budget_range VARCHAR(64) NULL,
                preferred_date VARCHAR(64) NULL,
                message TEXT NOT NULL,
                privacy_consent INTEGER DEFAULT 1,
                status VARCHAR(32) DEFAULT 'new',
                admin_notes TEXT NULL,
                ip_address VARCHAR(45) NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS media_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename VARCHAR(255) NOT NULL,
                original_name VARCHAR(255) NOT NULL,
                file_path VARCHAR(255) NOT NULL,
                mime_type VARCHAR(64) NOT NULL,
                file_size INTEGER NOT NULL,
                alt_text VARCHAR(255) NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NULL,
                username VARCHAR(64) NULL,
                role VARCHAR(32) NULL,
                action VARCHAR(128) NOT NULL,
                details TEXT NULL,
                ip_address VARCHAR(45) NOT NULL,
                user_agent TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS system_settings (
                key VARCHAR(64) PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");

        echo "Schema created successfully.\n";

        // Seed Users
        $clientHash = '$2y$12$/kXM008fOVouIQ8l6NDHceNhuh.sMtkJmBTpBNTALVm.aNtubnQn6';
        $devHash = '$2y$12$sjZFkptIkhlfGo.sGeYJrOvDARaWuDhfNI1u7d0eZOOgYv9sKg5le';
        
        $stmt = $db->prepare("INSERT OR IGNORE INTO users (username, email, password_hash, role, full_name, is_active) VALUES (?, ?, ?, ?, ?, 1)");
        $stmt->execute(['admin', 'admin@wropinterior.com', $clientHash, 'CLIENT_ADMIN', 'WROP Studio Manager']);
        $stmt->execute(['developer', 'developer@wropinterior.com', $devHash, 'DEVELOPER_ADMIN', 'Lead Systems Engineer']);

        // Seed Site Settings
        $settings = [
            'site_name' => 'WROP Interior',
            'tagline' => 'Spaces That Feel Like You',
            'contact_email' => 'hello@wropinterior.com',
            'contact_phone' => '+1 (555) 234-8900',
            'business_hours' => 'Monday — Friday: 9:00 AM — 6:00 PM',
            'instagram_url' => 'https://instagram.com/wropinterior',
            'pinterest_url' => 'https://pinterest.com/wropinterior',
            'linkedin_url' => 'https://linkedin.com/company/wropinterior',
            'footer_note' => 'All project imagery displayed during development is curated demonstration photography. Real projects will be published with client permission.',
            'seo_meta_title' => 'WROP Interior — Premium Interior Design & Space Transformation',
            'seo_meta_description' => 'Thoughtfully designed interiors that bring together functionality, aesthetics, and the way you live.'
        ];
        $sStmt = $db->prepare("INSERT OR REPLACE INTO site_settings (key, value, type) VALUES (?, ?, 'string')");
        foreach ($settings as $k => $v) {
            $sStmt->execute([$k, $v]);
        }

        // Seed System Settings
        $sysSettings = [
            'maintenance_mode' => '0',
            'maintenance_message' => 'WROP Interior digital studio is currently undergoing scheduled platform upgrades. We will be back online shortly.',
            'maintenance_bypass_key' => 'wrop_secure_preview_2026'
        ];
        $sysStmt = $db->prepare("INSERT OR REPLACE INTO system_settings (key, value) VALUES (?, ?)");
        foreach ($sysSettings as $k => $v) {
            $sysStmt->execute([$k, $v]);
        }

        // Seed Homepage Sections
        $secStmt = $db->prepare("INSERT OR REPLACE INTO homepage_sections (section_key, title, subtitle, content, settings_json, sort_order, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $secStmt->execute([
            'hero',
            'Spaces That Feel Like You.',
            'Thoughtfully designed interiors that bring together functionality, aesthetics, and the way you live.',
            '',
            json_encode([
                'desktop_image' => 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85',
                'mobile_image' => 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1080&q=85',
                'focal_point_x' => 50,
                'focal_point_y' => 50,
                'cta_primary_text' => 'EXPLORE OUR PROJECTS',
                'cta_primary_url' => '/projects',
                'cta_secondary_text' => "LET'S DISCUSS YOUR SPACE",
                'cta_secondary_url' => '/contact'
            ]),
            1,
            1
        ]);
        $secStmt->execute([
            'brand_intro',
            'Design That Goes Beyond the Surface.',
            'At WROP Interior, every space begins with an idea. We bring together thoughtful planning, carefully considered materials, and a distinctive design approach to create spaces that feel personal and purposeful.',
            '',
            json_encode(['image' => 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85', 'badge' => 'EDITORIAL APPROACH']),
            2,
            1
        ]);
        $secStmt->execute([
            'services',
            'Curated Interior Solutions',
            'From residential retreats to inspiring workplaces, our work balances aesthetics, comfort, and enduring craft.',
            '',
            json_encode(['limit' => 6]),
            3,
            1
        ]);
        $secStmt->execute([
            'featured_projects',
            'Selected Design Works',
            'An editorial collection of spatial concepts, material investigations, and interior studies.',
            '',
            json_encode(['limit' => 4]),
            4,
            1
        ]);
        $secStmt->execute([
            'philosophy',
            'Every Detail Has a Purpose.',
            'We believe that exceptional interiors are never accidental. They are shaped by the interplay of natural light, tactile authenticity, spatial clarity, and timeless proportion.',
            '',
            json_encode(['image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85']),
            5,
            1
        ]);
        $secStmt->execute([
            'design_process',
            'Our Thoughtful Process',
            'A structured, transparent pathway from initial discovery to spatial completion.',
            '',
            '',
            6,
            1
        ]);
        $secStmt->execute([
            'materials_gallery',
            'Materials & Tactile Palette',
            'Sensory finishes and architectural compositions that ground each space in natural luxury.',
            '',
            '',
            7,
            1
        ]);
        $secStmt->execute([
            'testimonials',
            'Client Reflections',
            'Reflections on spatial transformations and collaborative design journeys.',
            '',
            json_encode(['show_demo_label' => true]),
            8,
            1
        ]);
        $secStmt->execute([
            'final_cta',
            "Let's Create a Space That Feels Right.",
            'Tell us about your vision, and let\'s explore the possibilities.',
            '',
            json_encode(['image' => 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85', 'cta_text' => 'START YOUR PROJECT', 'cta_url' => '/contact']),
            9,
            1
        ]);

        // Seed Services
        $services = [
            ['Residential Interior Design', 'residential-interiors', 'Residential', 'Comprehensive design for entire homes, apartments, and private sanctuaries tailored to your rhythm of life.', 'Our residential interior design service takes an end-to-end editorial approach to creating living spaces that are both deeply functional and visually inspiring. We work closely with you from initial floor plan analysis to bespoke joinery, acoustic balance, and custom lighting layers.', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85', json_encode(["Full space spatial planning", "Custom millwork and built-ins", "Architectural lighting scheme", "Complete color and material curation", "Art and accessories direction"]), 1],
            ['Living Room Design', 'living-room-design', 'Residential', 'Harmonious gathering spaces balancing warmth, focal architectural balance, and generous comfort.', 'The living room is the emotional anchor of the home. We compose environments where conversation flows effortlessly, featuring sculptural seating, textural acoustic wall finishes, concealed storage, and curated ambient illumination.', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85', json_encode(["Ergonomic conversational seating arrangements", "Custom TV units & fireplace surrounds", "Curated tactile rugs & drapery", "Zoned mood lighting systems"]), 2],
            ['Modular Kitchen Design', 'modular-kitchen-design', 'Kitchen & Bath', 'Architectural culinary studios uniting precision European hardware with timeless natural surfaces.', 'A kitchen must be as delightful to work within as it is to behold. We design ergonomic work triangles, integrated concealed appliances, quartz and quartzite countertops, and bespoke fluted wood cabinetry.', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85', json_encode(["Ergonomic workflow optimization", "Integrated appliance planning", "Stone countertop and backsplash specification", "Hidden pantry and smart storage solutions"]), 3],
            ['Bedroom & Sanctuary Design', 'bedroom-design', 'Residential', 'Restful sanctuaries engineered with tactile textiles, acoustic warmth, and serene lighting.', 'Our bedroom concepts prioritize peaceful decompression. Through calibrated acoustic layering, upholstered headboard walls, indirect architectural coves, and serene color psychology, we create spaces of deep rest.', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85', json_encode(["Acoustic fabric wall panels", "Custom built-in headboards & floating nightstands", "Blackout automated drapery integration", "Calibrated circadian warm lighting"]), 4],
            ['Wardrobe & Dressing Suites', 'wardrobe-design', 'Joinery', 'Walk-in closets and bespoke wardrobe systems finished with fine veneer, bronze detailing, and tinted glass.', 'We transform dressing areas into boutique personal galleries. Featuring velvet-lined jewelry drawers, perimeter LED channel illumination, and integrated climate-balanced ventilation.', 'https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=1200&q=85', json_encode(["Bespoke walk-in dressing suites", "Integrated concealed lighting", "Fluted glass and aluminum frames", "Custom leather and brass drawer organizers"]), 5],
            ['Commercial & Office Interiors', 'commercial-interiors', 'Commercial', 'Forward-thinking corporate headquarters, boutique retail spaces, and creative studio environments.', 'Commercial design that reinforces brand identity while fostering collaboration and deep focus. We merge high-durability commercial materials with residential warmth to create environments people look forward to working in.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85', json_encode(["Activity-based spatial zoning", "Acoustic ceiling baffles and timber walls", "Branded reception and client presentation suites", "Commercial biophilic integrations"]), 6],
            ['Space Planning & Architectural Layouts', 'space-planning', 'Architecture', 'Rigorous spatial circulation analysis to unlock the true potential of your floor plan.', 'Before selecting a single textile, true luxury begins with proportion. We evaluate structural sightlines, natural daylight penetration, and micro-movements to craft intuitive flow throughout the property.', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85', json_encode(["Detailed 2D circulation flow layouts", "Daylight penetration and shadow study", "Demolition and partition reconfigurations", "Zoned privacy transitions"]), 7],
            ['Furniture & Material Selection', 'material-selection', 'Curation', 'Bespoke procurement of artisan furniture, rare stones, tactile textiles, and architectural hardware.', 'We curate materials that age gracefully over decades. From honed Travertine and brushed Fior di Bosco marble to Belgian linen and oiled white oak, our material palettes impart authentic character.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85', json_encode(["Physical material sample boards", "Trade-only furniture sourcing", "Custom artisan commissions", "Sustainable and non-toxic finish verification"]), 8]
        ];

        $srvStmt = $db->prepare("INSERT OR REPLACE INTO services (title, slug, category, short_description, full_description, featured_image, features_json, sort_order, is_published, seo_title, seo_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)");
        foreach ($services as $srv) {
            $srvStmt->execute([
                $srv[0], $srv[1], $srv[2], $srv[3], $srv[4], $srv[5], $srv[6], $srv[7],
                $srv[0] . ' — WROP Interior',
                $srv[3]
            ]);
        }

        // Seed Projects (Marked as Demo)
        $projects = [
            ['The Travertine Residence', 'the-travertine-residence', 'Residential', 'Concept Study', 1, 'A serene residential sanctuary grounded in warm limestone, fluted timber, and diffused natural light.', 'The Travertine Residence explores the convergence of architectural minimalism and tactile comfort. Conceived as a peaceful haven away from the metropolitan bustle, the design utilizes monolithic stone forms softened by billowing linen drapery and bespoke dark oak cabinetry.', 'Monolithic serenity through natural stone geometry and filtered daylight.', 'Honed Roman Travertine, American White Oak, Belgian Natural Linen, Brushed Bronze Hardware', 'Full interior architecture, spatial replanning, bespoke millwork, lighting specification', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85', json_encode(['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85']), 1, 1],
            ['Atelier V — Creative Studio', 'atelier-v-studio', 'Commercial', 'Design Exploration', 1, 'An open-concept creative studio balancing collaborative energy with focused architectural alcoves.', 'Designed for a high-pace multidisciplinary creative agency, Atelier V incorporates acoustic wool felt dividers, solid smoked oak communal benches, and warm architectural track lighting to provide an elevated work environment.', 'Biophilic productivity and acoustic harmony in an industrial volume.', 'Smoked European Oak, Recycled Wool Acoustic Felt, Textured Clay Plaster, Matte Black Steel', 'Commercial workplace zoning, acoustic consultation, bespoke conference tables', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85', json_encode(['https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85']), 1, 2],
            ['Komorebi Penthouse', 'komorebi-penthouse', 'Residential', 'Demonstration Showcase', 1, 'A dual-level penthouse celebrating the poetry of sunlight filtering through timber lattice screens.', 'Taking inspiration from Japanese and Scandinavian design sensibilities (Japandi), this penthouse focuses on low-slung furnishings, shoji-inspired sliding architectural partitions, and a continuous Microcement floor palette.', 'Warm Japandi minimalism celebrating shadow and light.', 'Hinoki and Ash Wood, Microcement, Hand-loomed Silk Wool Rugs, Matte Ceramic Tiles', 'Dual-level residential interior design, custom room dividers, curated furnishings', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85', json_encode(['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85']), 1, 3],
            ['The Clay & Brass Sanctuary', 'clay-and-brass-sanctuary', 'Residential', 'Demonstration Concept', 1, 'An intimate urban apartment centered around earthy lime-washed walls and patinated unlacquered brass.', 'In this residential study, textured clay plaster surfaces absorb harsh daylight, creating a soft cocooning ambiance. Custom brass details throughout the joinery will naturally patina over time, gaining character and depth.', 'Sensory richness through honest, unadorned materials that age gracefully.', 'Hand-applied Terracotta Clay Plaster, Unlacquered Brass, Calacatta Viola Marble, Oiled Walnut', 'Full spatial remodel, bespoke kitchen island, custom bathroom vanity and finishes', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85', json_encode(['https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85']), 1, 4]
        ];

        $prjStmt = $db->prepare("INSERT OR REPLACE INTO projects (title, slug, category, location, is_demo, short_description, full_description, concept, materials_finishes, scope, featured_image, gallery_json, is_featured, sort_order, is_published, seo_title, seo_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)");
        foreach ($projects as $p) {
            $prjStmt->execute([
                $p[0], $p[1], $p[2], $p[3], $p[4], $p[5], $p[6], $p[7], $p[8], $p[9], $p[10], $p[11], $p[12], $p[13],
                $p[0] . ' — WROP Interior Concept Study',
                $p[5]
            ]);
        }

        // Seed Journal
        $journal = [
            ['The Architecture of Silence: Designing for Sensory Calm', 'the-architecture-of-silence', 'Design Theory', 'How acoustic layering, tactile surfaces, and restrained palettes create sanctuaries in bustling metropolitan environments.', "In modern interior design, visual minimalism often commands the conversation. Yet the true measure of a peaceful home is acoustic and sensory. When we enter a space where sound doesn't bounce harshly off polished concrete and reflective glass, our nervous system immediately settles.\n\nAt WROP Interior, we achieve sensory calm by weaving acoustic dampening into structural elements: timber slat ceilings backed by recycled acoustic felt, lime plaster walls that softly diffuse sound waves, and double-lined linen drapery that frames views without rigidity.", 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85', '4 min read'],
            ['Natural Light as a Building Material', 'natural-light-as-a-building-material', 'Lighting', 'Understanding how sunlight shifts throughout the day enables us to choose materials that transform from morning clarity to evening intimacy.', "Light is not merely illumination; it is the most dynamic finish in any interior. Morning eastern sunlight carries cool blue undertones that accentuate stone and polished nickel. Late afternoon western rays cast long, amber shadows that bring alive textured clay plaster and rich walnut timber.\n\nDesigning with daylight requires mapping the sun's seasonal transit across floor plans. By placing reflective light shelves and sheer linen treatments strategically, we channel natural radiance into the deepest corridors of the home.", 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85', '5 min read'],
            ['The Beauty of Imperfection: Honest Materials That Age', 'beauty-of-imperfection-materials', 'Materials', 'Why we advocate for unlacquered brass, open-grain oak, and honed limestone that tell stories over decades.', "Modern synthetic surfaces promise perpetual perfection: stain-proof quartz, scratch-resistant laminates, sealed metals that never tarnish. Yet this artificial stillness can make spaces feel detached from life.\n\nLiving with authentic natural materials offers a richer dialogue. Unlacquered brass records the touch of family hands. Honed marble softens with use. Solid timber absorbs the climate and breathes. Choosing honest materials means choosing a home that grows more beautiful with each passing year.", 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85', '6 min read']
        ];

        $jStmt = $db->prepare("INSERT OR REPLACE INTO journal_articles (title, slug, category, excerpt, content, featured_image, read_time, is_published, published_at, seo_title, seo_description) VALUES (?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, ?, ?)");
        foreach ($journal as $j) {
            $jStmt->execute([
                $j[0], $j[1], $j[2], $j[3], $j[4], $j[5], $j[6],
                $j[0] . ' — WROP Interior Journal',
                $j[3]
            ]);
        }

        echo "All seed records created successfully!\n";
    } else {
        echo "MySQL driver detected. Executing MySQL schema and seed files...\n";
        $schema = file_get_contents(__DIR__ . '/schema.sql');
        $db->exec($schema);
        $seed = file_get_contents(__DIR__ . '/seed.sql');
        $db->exec($seed);
        echo "MySQL schema and seed executed successfully!\n";
    }

    echo "=== Database setup completed successfully! ===\n";

} catch (Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}
