import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools'))
from start_identity_uat import settings


class IdentityUat(unittest.TestCase):
    def test_requires_dedicated_identity_configuration(self):
        with self.assertRaises(ValueError):
            settings({'QAXC_AUTH_URL': 'https://existing.example', 'QAXC_AUTH_KEY': 'existing'})

    def test_rejects_non_loopback_plaintext_and_credentials_in_url(self):
        for url in ('http://example.org', 'https://user:password@example.org',
                    'https://example.org/auth?secret=example'):
            with self.subTest(url=url), self.assertRaises(ValueError):
                settings({'QAXC_UAT_AUTH_URL': url, 'QAXC_UAT_AUTH_KEY': 'test'})

    def test_never_inherits_business_database_or_outbound_integrations(self):
        source = dict(QAXC_UAT_AUTH_URL='http://127.0.0.1:18082/internal/qaxc',
                      QAXC_UAT_AUTH_KEY='test', QAXC_DB_URL='production',
                      QAXC_DATA='production', QAXC_WM_URL='production',
                      QAXC_WECHAT_APP_SECRET='production', QAXC_PASSWORD='production')
        env = settings(source)
        self.assertEqual(env['QAXC_AUTH_URL'], source['QAXC_UAT_AUTH_URL'])
        self.assertEqual(Path(env['QAXC_DATA']).name, 'identity-uat')
        self.assertNotIn('production', env.values())
