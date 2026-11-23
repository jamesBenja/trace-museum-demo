"""TRACE iPad layout regression: full-screen visitor app, readable controls and scan inputs."""
import os
from playwright.sync_api import sync_playwright

URL = os.getenv("TRACE_TEST_URL", "http://127.0.0.1:8765/?v=tablet1")
DEVICES = [
    ("iPad mini portrait", 768, 1024, True),
    ("iPad landscape", 1024, 768, True),
    ("iPad Pro landscape", 1366, 1024, True),
    ("phone", 390, 844, True),
    ("desktop", 1440, 900, False),
]

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True, args=["--no-sandbox"])
    for name, width, height, touch in DEVICES:
        context = browser.new_context(
            viewport={"width": width, "height": height},
            is_mobile=touch,
            has_touch=touch,
            device_scale_factor=2 if touch else 1,
            reduced_motion="reduce",
        )
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        response = page.goto(URL, wait_until="domcontentloaded", timeout=45000)
        assert response and response.status == 200, (name, "response")
        page.wait_for_function(
            "window.TRACE_V1 && window.TRACE_DISPLAY && !window.TRACE_DISPLAY.loading",
            timeout=40000,
        )
        layout = page.evaluate("""() => {
          const phone = document.querySelector('.phone');
          const shell = document.querySelector('.website');
          const nav = document.querySelector('.tabs');
          const rect = phone.getBoundingClientRect();
          return {
            viewport: window.innerWidth,
            x: rect.x, width: rect.width, height: rect.height,
            border: getComputedStyle(phone).borderLeftWidth,
            marketing: getComputedStyle(document.querySelector('.marketing')).display,
            shell: getComputedStyle(shell).display,
            navHeight: nav.getBoundingClientRect().height,
            overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
            coarse: matchMedia('(hover: none) and (pointer: coarse)').matches
          };
        }""")
        assert not layout["overflow"], (name, layout)
        if name == "desktop":
            assert layout["marketing"] != "none", (name, layout)
            assert layout["width"] <= 412, (name, layout)
        else:
            assert layout["marketing"] == "none", (name, layout)
            assert layout["shell"] == "block", (name, layout)
            assert layout["x"] == 0, (name, layout)
            assert abs(layout["width"] - layout["viewport"]) <= 2, (name, layout)
            assert layout["border"] == "0px", (name, layout)
            assert layout["navHeight"] >= 60, (name, layout)
            assert page.locator("#venueSwitcher").is_visible(), name
            assert page.locator('[data-tab="map"]').is_visible(), name
            if name.startswith("iPad"):
                assert layout["coarse"], (name, layout)
                assert page.locator(".trace-language-bar button").first.evaluate(
                    "(el) => el.getBoundingClientRect().height >= 39"
                ), name
                page.locator("#venueSwitcher").click()
                assert page.locator("#venuePicker").is_visible(), name
                page.locator('#venuePicker [data-venue="pamm"]').click()
                assert page.evaluate("state.venue") == "pamm", name
                page.locator('[data-tab="map"]').click()
                assert page.locator("#view").is_visible(), name
                assert page.locator("#view").evaluate(
                    "(el) => el.getBoundingClientRect().width > 700"
                ), name
                page.evaluate("state.tab='quest'; state.stage='scan'; render()")
                assert page.locator("#scanUpload").count() == 1, name
                assert page.locator("#scanCamera").count() == 1, name
                assert page.locator("#scanUpload").get_attribute("capture") is None, name
                assert page.locator("#scanCamera").get_attribute("capture") == "environment", name
                assert page.locator(".scanPhotoActions > label").count() == 2, name
                assert page.locator(".scanPhotoActions > label").first.evaluate(
                    "(el) => el.getBoundingClientRect().height >= 44"
                ), name
                assert page.locator(".scanViewport").evaluate(
                    "(el) => el.getBoundingClientRect().height >= 210"
                ), name
        assert not errors, (name, errors)
        print("TABLET RESPONSIVE PASS", name, layout["viewport"], flush=True)
        context.close()
    browser.close()
print("ALL DEVICE LAYOUT CHECKS PASSED", flush=True)
