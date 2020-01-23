//
//  CoopCycleUITests.swift
//  CoopCycleUITests
//
//  Created by admin on 22/01/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

import XCTest

class CoopCycleUITests: XCTestCase {

    override func setUp() {
        // Put setup code here. This method is called before the invocation of each test method in the class.

        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = false
      
        super.setUp()

        // UI tests must launch the application that they test. Doing this in setup will make sure it happens for each test method.
        let app = XCUIApplication()
        setupSnapshot(app)
        app.launch()

        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
    }

    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func testExample() {
        // Use recording to get started writing UI tests.
        // Use XCTAssert and related functions to verify your tests produce the correct results.
        // https://krausefx.com/blog/run-xcode-7-ui-tests-from-the-command-line
        // https://www.hackingwithswift.com/articles/148/xcode-ui-testing-cheat-sheet
      
        let app = XCUIApplication()

        // Wait for the button to appear
        app.otherElements["chooseCityBtn"].waitForExistence(timeout: 30)
      
        // print(app.debugDescription)
      
        snapshot("00_Home")
      
        // Tap the button
        app.otherElements["chooseCityBtn"].firstMatch.tap()
      
        snapshot("01_ChooseCity")
    }

}
