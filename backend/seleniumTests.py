from selenium import webdriver

from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
PATH = "C:\Program Files (x86)\chromedriver.exe"
driver = webdriver.Chrome(PATH)


def testRegister():
    driver.get("http://localhost:3000/register/")
    driver.find_element("name", "username").send_keys("moxil")
    driver.find_element("name", "display_name").send_keys("DisplayNameMoxil")
    driver.find_element("name", "github").send_keys("https://github.com/moxil-shah")
    driver.find_element("name", "password").send_keys("123456789")
    driver.find_element("name", "reenter_password").send_keys("123456789")
    driver.find_element(By.XPATH, '//button[normalize-space()="Sign Up"]').click()
    print("Sucessful Registration!")

def testLogin():
    driver.get("http://localhost:3000/login/")
    driver.find_element("name", "username").send_keys("moxil")
    driver.find_element("name", "password").send_keys("123456789")
 
    driver.find_element(By.XPATH, '//button[normalize-space()="Sign In"]').click()
    print("Sucessful Login!")

if __name__ == "__main__":
   testRegister()
   testLogin()
