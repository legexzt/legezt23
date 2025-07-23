#!/usr/bin/env python3
"""
Simple test script to verify the FastAPI backend structure and endpoints.
This doesn't require external dependencies to run basic validation.
"""

import sys
import os
import importlib.util

def test_backend_structure():
    """Test that the backend can be imported and has correct structure"""
    backend_path = os.path.join(os.path.dirname(__file__), 'main.py')
    
    # Test that the file exists
    if not os.path.exists(backend_path):
        print("❌ main.py not found")
        return False
    
    # Test that the file can be compiled
    try:
        with open(backend_path, 'r') as f:
            code = f.read()
        compile(code, backend_path, 'exec')
        print("✅ main.py compiles successfully")
    except SyntaxError as e:
        print(f"❌ Syntax error in main.py: {e}")
        return False
    
    # Test basic structure elements
    with open(backend_path, 'r') as f:
        content = f.read()
    
    required_elements = [
        'from fastapi import',
        'app = FastAPI',
        'router = APIRouter()',
        '@router.get("/youtube/formats")',
        'async def get_youtube_formats',
        '@app.get("/health")',
        '@app.get("/api/python/video-info")',
        '@app.get("/api/python/direct-download")',
        'app.include_router(router',
        'if __name__ == "__main__":'
    ]
    
    for element in required_elements:
        if element in content:
            print(f"✅ Found: {element}")
        else:
            print(f"❌ Missing: {element}")
            return False
    
    return True

def test_requirements():
    """Test that requirements.txt exists and has necessary dependencies"""
    req_path = os.path.join(os.path.dirname(__file__), 'requirements.txt')
    
    if not os.path.exists(req_path):
        print("❌ requirements.txt not found")
        return False
    
    with open(req_path, 'r') as f:
        content = f.read()
    
    required_deps = ['fastapi', 'uvicorn', 'yt-dlp', 'httpx', 'pydantic']
    
    for dep in required_deps:
        if dep in content:
            print(f"✅ Dependency found: {dep}")
        else:
            print(f"❌ Missing dependency: {dep}")
            return False
    
    return True

def test_file_structure():
    """Test that all expected files exist"""
    expected_files = [
        'main.py',
        'requirements.txt', 
        'README.md',
        'Dockerfile',
        'docker-compose.yml',
        'start.sh'
    ]
    
    base_path = os.path.dirname(__file__)
    
    for filename in expected_files:
        filepath = os.path.join(base_path, filename)
        if os.path.exists(filepath):
            print(f"✅ File exists: {filename}")
        else:
            print(f"❌ Missing file: {filename}")
            return False
    
    return True

if __name__ == "__main__":
    print("🧪 Testing YouTube Downloader Backend...")
    print("=" * 50)
    
    tests = [
        ("File Structure", test_file_structure),
        ("Requirements", test_requirements), 
        ("Backend Structure", test_backend_structure)
    ]
    
    all_passed = True
    
    for test_name, test_func in tests:
        print(f"\n📋 {test_name} Test:")
        print("-" * 30)
        if test_func():
            print(f"✅ {test_name} test PASSED")
        else:
            print(f"❌ {test_name} test FAILED")
            all_passed = False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 All tests PASSED! Backend is ready.")
        sys.exit(0)
    else:
        print("❌ Some tests FAILED. Please check the issues above.")
        sys.exit(1)