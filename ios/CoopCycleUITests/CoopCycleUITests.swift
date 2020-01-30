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
        XCUIApplication().terminate()
        super.tearDown()
    }

    func testExample() {
        // Use recording to get started writing UI tests.
        // Use XCTAssert and related functions to verify your tests produce the correct results.
        // https://krausefx.com/blog/run-xcode-7-ui-tests-from-the-command-line
        // https://www.hackingwithswift.com/articles/148/xcode-ui-testing-cheat-sheet
        // https://www.raywenderlich.com/233168-fastlane-tutorial-getting-started

        let app = XCUIApplication()

        // Wait for the button to appear
        // Use a large timeout, to make sure the JavaScript bundle has been downloaded
        app.otherElements["chooseCityBtn"].waitForExistence(timeout: 120)

        snapshot("00_Home")

        // Tap the button
        app.otherElements["chooseCityBtn"].firstMatch.tap()

        snapshot("01_ChooseCity")

        app.otherElements["Poitiers"].firstMatch.tap()

        snapshot("02_Restaurants")

        app.otherElements["restaurantList"].waitForExistence(timeout: 15)

        app.otherElements["restaurants:2"].tap()

        snapshot("03_Restaurant")

        app.otherElements["menu"].waitForExistence(timeout: 5)
        app.otherElements["menuItem:0:0"].waitForExistence(timeout: 5)

        app.otherElements["menuItem:0:0"].tap()

        app.otherElements["addressModal"].waitForExistence(timeout: 5)
        app.textFields["addressModalTypeahead"].waitForExistence(timeout: 5)

        app.textFields["addressModalTypeahead"].typeText("23 av claude vellefaux")
    }

}
