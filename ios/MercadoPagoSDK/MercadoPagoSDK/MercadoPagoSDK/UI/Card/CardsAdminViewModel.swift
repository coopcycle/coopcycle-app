//
//  CardsAdminViewModel.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 4/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

internal class CardsAdminViewModel {

    var cards: [PXCard]?
    var customerId: String?
    var extraOptionTitle: String?
    var confirmPromptText: String?
    var titleScreen = "¿Con qué tarjeta?".localized

    // View Constants
    let screenWidth: CGFloat = UIScreen.main.bounds.width
    let titleCellHeight: CGFloat = 82.0
    var paddingSpace: CGFloat = CGFloat(32.0)
    let itemsPerRow: Int = 2
    lazy var availableWidth: CGFloat = self.screenWidth - self.paddingSpace
    lazy var widthPerItem: CGFloat = self.availableWidth / CGFloat(self.itemsPerRow)

    public init(cards: [PXCard]? = nil, extraOptionTitle: String? = nil, confirmPromptText: String? = nil) {
        self.cards = cards
        self.extraOptionTitle = extraOptionTitle
        self.confirmPromptText = confirmPromptText
    }

    func numberOfOptions() -> Int {
        var count = 0

        if hasCards() {
            count += cards!.count
        }
        return hasExtraOption() ? count + 1 : count
    }

    func hasExtraOption() -> Bool {
        return !String.isNullOrEmpty(extraOptionTitle)
    }

    func hasCards() -> Bool {
        return !Array.isNullOrEmpty(cards)
    }

    func hasConfirmPromptText() -> Bool {
        return !String.isNullOrEmpty(confirmPromptText)
    }

    func setScreenTitle(title: String) {
        self.titleScreen = title
    }

    func getScreenTitle() -> String {
        return titleScreen
    }

    func getAlertCardTitle(card: PXCard) -> String {
        var title: String = ""
        if !String.isNullOrEmpty(card.paymentMethod?.name) {
            title = card.paymentMethod!.name! + " "
        }
        return title.appending(card.getTitle())
    }

    // Height functions

    func calculateHeight(indexPath: IndexPath) -> CGFloat {
        if numberOfOptions() == 0 {
            return 0
        }
        let firstCardIndex = indexOfFirsCardInSection(row: indexPath.row)
        let secondCardIndex = firstCardIndex + 1

        let firstCardHeight = heightOfItem(indexItem: firstCardIndex)

        if secondCardIndex < numberOfOptions() {
            let secondCardHeight = heightOfItem(indexItem: secondCardIndex)
            return CGFloat.maximum(firstCardHeight, secondCardHeight)

        }
        return firstCardHeight

    }

    func heightOfItem(indexItem: Int) -> CGFloat {
        if isCardItemFor(indexPath: IndexPath(row: indexItem, section: 1)) {
            return PaymentSearchCollectionViewCell.totalHeight(drawablePaymentOption: cards![indexItem])

        } else if isExtraOptionItemFor(indexPath: IndexPath(row: indexItem, section: 1)) {
            return PaymentSearchCollectionViewCell.totalHeight(title: self.extraOptionTitle, subtitle: nil)
        }
        return 0
    }

    func sizeForItemAt(indexPath: IndexPath) -> CGSize {
        if self.isHeaderSection(section: indexPath.section) {
            return CGSize(width: screenWidth, height: titleCellHeight)

        } else if self.isCardItemFor(indexPath: indexPath) || self.isExtraOptionItemFor(indexPath: indexPath) {
            return CGSize(width: widthPerItem, height: calculateHeight(indexPath: indexPath))
        }
        return CGSize.zero
    }

    // Sections and Index Functions

    func indexOfFirsCardInSection(row: Int) -> Int {
        var row = row
        if row % itemsPerRow == 1 {
            row -= 1
        }
        return row
    }

    func isHeaderSection(section: Int) -> Bool {
        return section == 0
    }

    func isCardsSection(section: Int) -> Bool {
        return section == 1
    }

    func numberOfSections() -> Int {
        return 2
    }

    public func numberOfItemsInSection (section: Int) -> Int {
        if self.isHeaderSection(section: section) {
            return 1
        }
        return self.numberOfOptions()
    }

    func isCardItemFor(indexPath: IndexPath) -> Bool {
        if hasCards() && self.isCardsSection(section: indexPath.section) && cards!.count > indexPath.row {
            return true
        }
        return false
    }

    func isExtraOptionItemFor(indexPath: IndexPath) -> Bool {
        if isCardItemFor(indexPath: indexPath) {
            return false
        } else if isCardsSection(section: indexPath.section) && hasExtraOption() && indexPath.row < numberOfOptions() {
            return true
        }
        return false
    }
}
