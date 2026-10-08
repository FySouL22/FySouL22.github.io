import tempfile
import unittest
from pathlib import Path

from deploy_homelab import LOOPBACK_PORT_BINDINGS, patch_compose_loopback


class ComposeHardeningTests(unittest.TestCase):
    def write_compose(self, content):
        temp_dir = tempfile.TemporaryDirectory()
        self.addCleanup(temp_dir.cleanup)
        path = Path(temp_dir.name) / "docker-compose.yml"
        path.write_text(content, encoding="utf-8")
        return path

    def test_all_expected_ports_are_bound_to_loopback(self):
        compose = "\n".join(original for original, _ in LOOPBACK_PORT_BINDINGS)
        path = self.write_compose(compose)

        self.assertTrue(patch_compose_loopback(str(path)))
        hardened = path.read_text(encoding="utf-8")
        for _, expected in LOOPBACK_PORT_BINDINGS:
            self.assertIn(expected, hardened)
        self.assertNotIn("DISABLE_SECURITY_PLUGIN=true", hardened)

    def test_refuses_disabled_indexer_security_plugin(self):
        compose = "\n".join(original for original, _ in LOOPBACK_PORT_BINDINGS)
        path = self.write_compose(compose + "\n      - \"DISABLE_SECURITY_PLUGIN=true\"\n")

        self.assertFalse(patch_compose_loopback(str(path)))

    def test_fails_closed_when_upstream_port_mapping_changes(self):
        compose = "\n".join(
            original for original, _ in LOOPBACK_PORT_BINDINGS
            if original != '- "9200:9200"'
        )
        path = self.write_compose(compose)

        self.assertFalse(patch_compose_loopback(str(path)))

    def test_patch_is_idempotent(self):
        compose = "\n".join(original for original, _ in LOOPBACK_PORT_BINDINGS)
        path = self.write_compose(compose)

        self.assertTrue(patch_compose_loopback(str(path)))
        self.assertTrue(patch_compose_loopback(str(path)))


if __name__ == "__main__":
    unittest.main()
