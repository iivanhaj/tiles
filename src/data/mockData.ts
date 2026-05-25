/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tile, Friend, MoodType } from '../types';

export const DEFAULT_USER = {
  id: 'user_main',
  username: 'Jahnavi',
  avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdC_o989ttA_KAXk6liAtjtvOrhpTmBrW45MPAVoVQETZK4KrdkRkonKLWYB1-odsMSUIc1Nhko7DU1iwhy2C161PdiLmEFqO99yPuIFjFzyjOC5bpBWmRDCAE2wtNj9iBmhLXgWVZArWUuh8VFjtxbx7Di0V3Hmgf9kgDPj5JYAQtbKneH5UsaHg99Yg-A2j1A1EoOyTFHpfNUY6skxvDAUaS03Cf1zVAC4CrlRSE5xiCvsf1gC1QeieSQUk39hsi-KmlgWgf0aD5',
  email: 'jahnavimajumder7@gmail.com',
};

export const MOCK_FRIENDS: Friend[] = [
  {
    id: 'friend_sienna',
    username: 'sienna_gold',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzjGzJ0wMlpLwMLenVYCN-k0PPw2PAGt-6SYIIH7BWgZdB9WiQNPL-WSYebU2RQrd0AMOO8F02_1TW3PO7sLSRCLgm9_AmrVh-DsKRd77K9ypi6llIaqb7a-N-Z0koyGjlv3Qxp8UNDsp8enYp7H2bfDK5I7Pd53u0Moi3WAfyJW26i_2l6_IjH-YDPOs5ICBAiV8KMgnE0UYFy-wOeOzhqP0rZwbxX1ofmqKlDtntLcVHgsRrCK1toRmcnx_tLfPTLUpGbCtYc4vh',
    status: 'friends',
  },
  {
    id: 'friend_julian',
    username: 'julian_breeze',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfwzGEXqxW966npU1rVxBHFcZ17M1WVquPgDn3LCwwNAiaqmnju-ceftckN1Eqy-Fk3X4keHmzGB1YT6w58D0K7YJMnvc3pMdY0rRPR1FWQtAys-wfOsEtB_pxgkTfDR_wgx2KQma6K3wbqm1bLaxahhOhWOLWvXOLV9UBEJFWm_BS7nqKmNYdFYROfjNOt2UY1WIaKGi2yfm8--x3xBzrwUCGS3w28-Ho3nUouko9TS4i_ovgIBekGuijeTsAPUz07tlosRrZIqZS',
    status: 'friends',
  },
  {
    id: 'friend_maya',
    username: 'maya_journal',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=85',
    status: 'friends',
  },
  {
    id: 'friend_leo',
    username: 'leo_wood',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=85',
    status: 'friends',
  },
  {
    id: 'friend_elena',
    username: 'elena_slow',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=85',
    status: 'requested',
  },
];

export const SUGGESTED_UPLOADS = [
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBllPr8rLVgo8Csn-ra3g9s8Iwyk9QhzM4xzLZCJxNOLIQp-WPjW-EKPvpaYnSvV-a29NEyJuXQQ_1i-sMSTxAEJIGxi-w_DE35cOmAPPhabkfczsWIlN-oCcFm1to5UxSBXrKEBegkoAtVDsjZas9SBeYaGccgXoPaU_jOurOM48tOp8nfrt88dotKr0mOpMraVMmnh9NMuOg8D7ZlK00UuBJR-9XyVU022YevoXsikRR-HstJ1y67ZF3UygM5zcaqMzfVaBNF0bRZ',
    caption: 'Quiet sunset reflecting on a perfectly still lake...',
    mood: 'sun'
  },
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF2D-fLwxlU3l3Fq9rA5DjV2fkhfOO6VQcBYAoVqFZV_qeoLEQoOucpYQdJqQziDVnh_g-e6D78CywkTIroLSfSwn2c_HaaEiQurHW4yOs8UsLUUvyzP6Ojh8WIv1nREVqy5Uxxq6YkWXBCQgZ01SkD25Mpnw5rl-QgyyM8UQToDyFAmE1LRvudt3oET1z5aYXvFUvT5XLwGTX7vGFnwUT0pKgV3Xw2II3uzvtNd9Jov9kdJBiuQJtaTjNEnORiX7uc8MdmJcL9SKa',
    caption: 'Warm glow over the gentle rippling sea.',
    mood: 'zzz'
  },
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdsKoRNm7aGnYCopFo0omq8xBzZOG4mFSspEo--k3aJBVNCs9lSqkAKojgnNoo9yhgtAY1gvnpoYkEW-h3hmEec2oT-QoXBlT2Flt5pnSRfAX_oGYc7jRzYflXlJKFvEt0pT9vgwYzzPVUmeMDSsa7WTNcdLP3zYB9_2tPfggz6n9hpluAKjvGlZ8e9YMcSw7-9mnqNGTGpaTDaLXfL7GuB8Z3yaloanuhwVTNpSqU278kJBBc1wxpfQddItyr05R7TAp93cHSHqZO',
    caption: 'Slow morning in a coastal Italian village, shadows of olive leaves.',
    mood: 'sprout'
  },
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3Wt-9gyuriYhaX611Sa2ax9VxB33_9i4sp8xUiAFVVY6-2S61XDY9zvQ7mD_oQF3fcZFCJNMtXDRBCuGXhgsGredpzY-Dqf-oNb6Ggz139q3Evpxu86eC_jQmUwOx3e5W2PwDPBvPoMq8gobOwoVkqdkFgHzBbBuVha_auHiodPJt5qJuMvOwN4UwSyl3BHhModokiWLEhWlmm7FJ-Q7Up4KRNIem_AA0ZZc7Y6L8M_RZdd9SzjsPH_VZzMZcXQlBaWbQyIOXUW8H',
    caption: 'A soft-focused stone balcony in full sun-drenched glory.',
    mood: 'sun'
  },
  {
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
    caption: 'Green canopy filtering soft warm light onto the forest floor.',
    mood: 'sprout'
  },
  {
    url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
    caption: 'Freshly ground clay-filtered brew on a quiet window sill.',
    mood: 'heart'
  },
  {
    url: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&w=600&q=80',
    caption: 'Cozy fireplace embers warming up the chilly spring evening.',
    mood: 'zzz'
  }
];

// Curate custom monthly tiles for Jahnavi (User) and friends for May 2026!
export const INITIAL_TILES: Tile[] = [
  // User's own historical tiles in May 2026
  {
    id: 'tile_user_01',
    user_id: 'user_main',
    username: 'Jahnavi',
    avatar_url: DEFAULT_USER.avatar_url,
    date: '2026-05-01',
    image_url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
    caption: 'Starting May with a slow walk through the ancient oak gardens.',
    mood: 'sprout',
    created_at: '2026-05-01T10:14:00Z',
    reactions: [
      { id: 'r1', tile_id: 'tile_user_01', user_id: 'friend_sienna', username: 'sienna_gold', emoji: '❤️' },
      { id: 'r2', tile_id: 'tile_user_01', user_id: 'friend_julian', username: 'julian_breeze', emoji: '🌱' }
    ]
  },
  {
    id: 'tile_user_03',
    user_id: 'user_main',
    username: 'Jahnavi',
    avatar_url: DEFAULT_USER.avatar_url,
    date: '2026-05-03',
    image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
    caption: 'Warm ceramic filter coffee and a light book. Restful Sunday.',
    mood: 'heart',
    created_at: '2026-05-03T09:30:11Z',
    reactions: [
      { id: 'r3', tile_id: 'tile_user_03', user_id: 'friend_maya', username: 'maya_journal', emoji: '💤' },
      { id: 'r4', tile_id: 'tile_user_03', user_id: 'friend_leo', username: 'leo_wood', emoji: '☀️' }
    ]
  },
  {
    id: 'tile_user_05',
    user_id: 'user_main',
    username: 'Jahnavi',
    avatar_url: DEFAULT_USER.avatar_url,
    date: '2026-05-05',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdsKoRNm7aGnYCopFo0omq8xBzZOG4mFSspEo--k3aJBVNCs9lSqkAKojgnNoo9yhgtAY1gvnpoYkEW-h3hmEec2oT-QoXBlT2Flt5pnSRfAX_oGYc7jRzYflXlJKFvEt0pT9vgwYzzPVUmeMDSsa7WTNcdLP3zYB9_2tPfggz6n9hpluAKjvGlZ8e9YMcSw7-9mnqNGTGpaTDaLXfL7GuB8Z3yaloanuhwVTNpSqU278kJBBc1wxpfQddItyr05R7TAp93cHSHqZO',
    caption: 'Citrus trees and terracotta rooftops. Pure sun-drenched peace.',
    mood: 'sun',
    created_at: '2026-05-05T14:45:00Z',
    reactions: [
      { id: 'r5', tile_id: 'tile_user_05', user_id: 'friend_sienna', username: 'sienna_gold', emoji: '☀️' }
    ]
  },
  {
    id: 'tile_user_10',
    user_id: 'user_main',
    username: 'Jahnavi',
    avatar_url: DEFAULT_USER.avatar_url,
    date: '2026-05-10',
    image_url: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&w=600&q=80',
    caption: 'Gathered around the crackling fireplace with family.',
    mood: 'zzz',
    created_at: '2026-05-10T21:05:32Z',
    reactions: [
      { id: 'r6', tile_id: 'tile_user_10', user_id: 'friend_julian', username: 'julian_breeze', emoji: '❤️' }
    ]
  },
  {
    id: 'tile_user_11',
    user_id: 'user_main',
    username: 'Jahnavi',
    avatar_url: DEFAULT_USER.avatar_url,
    date: '2026-05-11',
    image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    caption: 'Saturating in nostalgic old paper and ink pens.',
    mood: 'heart',
    created_at: '2026-05-11T12:00:10Z',
    reactions: []
  },
  {
    id: 'tile_user_15',
    user_id: 'user_main',
    username: 'Jahnavi',
    avatar_url: DEFAULT_USER.avatar_url,
    date: '2026-05-15',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    caption: 'Waves licking the warm sand softly. Grounding afternoon.',
    mood: 'sprout',
    created_at: '2026-05-15T16:15:00Z',
    reactions: [
      { id: 'r7', tile_id: 'tile_user_15', user_id: 'friend_maya', username: 'maya_journal', emoji: '🌱' },
      { id: 'r8', tile_id: 'tile_user_15', user_id: 'friend_leo', username: 'leo_wood', emoji: '❤️' }
    ]
  },
  {
    id: 'tile_user_19',
    user_id: 'user_main',
    username: 'Jahnavi',
    avatar_url: DEFAULT_USER.avatar_url,
    date: '2026-05-19',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3Wt-9gyuriYhaX611Sa2ax9VxB33_9i4sp8xUiAFVVY6-2S61XDY9zvQ7mD_oQF3fcZFCJNMtXDRBCuGXhgsGredpzY-Dqf-oNb6Ggz139q3Evpxu86eC_jQmUwOx3e5W2PwDPBvPoMq8gobOwoVkqdkFgHzBbBuVha_auHiodPJt5qJuMvOwN4UwSyl3BHhModokiWLEhWlmm7FJ-Q7Up4KRNIem_AA0ZZc7Y6L8M_RZdd9SzjsPH_VZzMZcXQlBaWbQyIOXUW8H',
    caption: 'Soft golden rays leaking on the clay brick walkways.',
    mood: 'sun',
    created_at: '2026-05-19T17:40:00Z',
    reactions: [
      { id: 'r9', tile_id: 'tile_user_19', user_id: 'friend_sienna', username: 'sienna_gold', emoji: '❤️' }
    ]
  },

  // Friends' historical and active tiles for May 2026
  {
    id: 'tile_sienna_19',
    user_id: 'friend_sienna',
    username: 'sienna_gold',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzjGzJ0wMlpLwMLenVYCN-k0PPw2PAGt-6SYIIH7BWgZdB9WiQNPL-WSYebU2RQrd0AMOO8F02_1TW3PO7sLSRCLgm9_AmrVh-DsKRd77K9ypi6llIaqb7a-N-Z0koyGjlv3Qxp8UNDsp8enYp7H2bfDK5I7Pd53u0Moi3WAfyJW26i_2l6_IjH-YDPOs5ICBAiV8KMgnE0UYFy-wOeOzhqP0rZwbxX1ofmqKlDtntLcVHgsRrCK1toRmcnx_tLfPTLUpGbCtYc4vh',
    date: '2026-05-19',
    image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    caption: 'Found an incredible foggy forest retreat while roaming.',
    mood: 'sprout',
    created_at: '2026-05-19T08:12:00Z',
    reactions: []
  },
  {
    id: 'tile_julian_19',
    user_id: 'friend_julian',
    username: 'julian_breeze',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfwzGEXqxW966npU1rVxBHFcZ17M1WVquPgDn3LCwwNAiaqmnju-ceftckN1Eqy-Fk3X4keHmzGB1YT6w58D0K7YJMnvc3pMdY0rRPR1FWQtAys-wfOsEtB_pxgkTfDR_wgx2KQma6K3wbqm1bLaxahhOhWOLWvXOLV9UBEJFWm_BS7nqKmNYdFYROfjNOt2UY1WIaKGi2yfm8--x3xBzrwUCGS3w28-Ho3nUouko9TS4i_ovgIBekGuijeTsAPUz07tlosRrZIqZS',
    date: '2026-05-19',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBllPr8rLVgo8Csn-ra3g9s8Iwyk9QhzM4xzLZCJxNOLIQp-WPjW-EKPvpaYnSvV-a29NEyJuXQQ_1i-sMSTxAEJIGxi-w_DE35cOmAPPhabkfczsWIlN-oCcFm1to5UxSBXrKEBegkoAtVDsjZas9SBeYaGccgXoPaU_jOurOM48tOp8nfrt88dotKr0mOpMraVMmnh9NMuOg8D7ZlK00UuBJR-9XyVU022YevoXsikRR-HstJ1y67ZF3UygM5zcaqMzfVaBNF0bRZ',
    caption: 'Finally found that quiet sunset spot by the lake...',
    mood: 'sun',
    created_at: '2026-05-19T18:02:00Z',
    reactions: [
      { id: 'r10', tile_id: 'tile_julian_19', user_id: 'user_main', username: 'Jahnavi', emoji: '❤️' }
    ]
  },

  // TODAY is May 20, 2026. Sienna and Julian have already posted moments!
  // BUT the user "Jahnavi" has not posted yet by default. This activates the Tile Lock System!
  {
    id: 'tile_sienna_20',
    user_id: 'friend_sienna',
    username: 'sienna_gold',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzjGzJ0wMlpLwMLenVYCN-k0PPw2PAGt-6SYIIH7BWgZdB9WiQNPL-WSYebU2RQrd0AMOO8F02_1TW3PO7sLSRCLgm9_AmrVh-DsKRd77K9ypi6llIaqb7a-N-Z0koyGjlv3Qxp8UNDsp8enYp7H2bfDK5I7Pd53u0Moi3WAfyJW26i_2l6_IjH-YDPOs5ICBAiV8KMgnE0UYFy-wOeOzhqP0rZwbxX1ofmqKlDtntLcVHgsRrCK1toRmcnx_tLfPTLUpGbCtYc4vh',
    date: '2026-05-20',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF2D-fLwxlU3l3Fq9rA5DjV2fkhfOO6VQcBYAoVqFZV_qeoLEQoOucpYQdJqQziDVnh_g-e6D78CywkTIroLSfSwn2c_HaaEiQurHW4yOs8UsLUUvyzP6Ojh8WIv1nREVqy5Uxxq6YkWXBCQgZ01SkD25Mpnw5rl-QgyyM8UQToDyFAmE1LRvudt3oET1z5aYXvFUvT5XLwGTX7vGFnwUT0pKgV3Xw2II3uzvtNd9Jov9kdJBiuQJtaTjNEnORiX7uc8MdmJcL9SKa',
    caption: 'A gentle archway looking over a silent sunrise.',
    mood: 'zzz',
    created_at: '2026-05-20T06:45:00Z',
    reactions: []
  },
  {
    id: 'tile_julian_20',
    user_id: 'friend_julian',
    username: 'julian_breeze',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfwzGEXqxW966npU1rVxBHFcZ17M1WVquPgDn3LCwwNAiaqmnju-ceftckN1Eqy-Fk3X4keHmzGB1YT6w58D0K7YJMnvc3pMdY0rRPR1FWQtAys-wfOsEtB_pxgkTfDR_wgx2KQma6K3wbqm1bLaxahhOhWOLWvXOLV9UBEJFWm_BS7nqKmNYdFYROfjNOt2UY1WIaKGi2yfm8--x3xBzrwUCGS3w28-Ho3nUouko9TS4i_ovgIBekGuijeTsAPUz07tlosRrZIqZS',
    date: '2026-05-20',
    image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
    caption: 'Tasting a freshly slow-dripped blend today. Pure warmth.',
    mood: 'heart',
    created_at: '2026-05-20T08:10:00Z',
    reactions: []
  }
];
