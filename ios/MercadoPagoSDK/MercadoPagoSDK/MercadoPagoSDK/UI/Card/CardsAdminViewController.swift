//
//  CardsAdminViewController.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 4/10/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

//TODO: Delete post v4.0
internal class CardsAdminViewController: MercadoPagoUIScrollViewController, UICollectionViewDataSource, UICollectionViewDelegate, UICollectionViewDelegateFlowLayout {

    @IBOutlet weak var collectionSearch: UICollectionView!

    static let VIEW_CONTROLLER_NIB_NAME: String = "CardsAdminViewController"

    var merchantBaseUrl: String!
    var merchantAccessToken: String!
    var publicKey: String!
    var currency: PXCurrency!
    var defaultInstallments: Int?
    var installments: Int?
    var viewModel: CardsAdminViewModel!

    var bundle = ResourceManager.shared.getBundle()

    var titleSectionReference: PaymentVaultTitleCollectionViewCell!

    private var tintColor = true

    private let sectionInsets = UIEdgeInsets(top: 50.0, left: 20.0, bottom: 50.0, right: 20.0)

    private var defaultOptionSelected = false

    private var callback : ((_ selectedCard: PXCard?) -> Void)!

    public init(viewModel: CardsAdminViewModel, callback : @escaping (_ selectedCard: PXCard?) -> Void) {
        super.init(nibName: CardsAdminViewController.VIEW_CONTROLLER_NIB_NAME, bundle: bundle)
        self.viewModel = viewModel
        self.callback = callback
    }

    public required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    open override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.hideNavBar()
        self.navigationController!.navigationBar.shadowImage = nil
        self.extendedLayoutIncludesOpaqueBars = true
    }

    func addTopHeader() {
        var upperFrame = self.collectionSearch.bounds
        upperFrame.origin.y = -upperFrame.size.height + 10
        upperFrame.size.width = UIScreen.main.bounds.width
        let upperView = UIView(frame: upperFrame)
        upperView.backgroundColor = UIColor.primaryColor()
        collectionSearch.addSubview(upperView)
    }

    func setTitle() {
        if String.isNullOrEmpty(title) {
            self.title = self.viewModel.getScreenTitle()
        }
    }

    open override func viewDidLoad() {
        super.viewDidLoad()
        self.addCallbackCancel()

        self.addTopHeader()
        self.collectionSearch.backgroundColor = .white
        self.setTitle()
        self.registerAllCells()

        self.collectionSearch.delegate = self
        self.collectionSearch.dataSource = self
        self.collectionSearch.reloadData()

        self.collectionSearch.allowsSelection = true
        self.hideNavBarCallback = self.hideNavBarCallbackDisplayTitle()
    }

    fileprivate func registerAllCells() {
        let collectionSearchCell = UINib(nibName: "PaymentSearchCollectionViewCell", bundle: self.bundle)
        self.collectionSearch.register(collectionSearchCell, forCellWithReuseIdentifier: "searchCollectionCell")
        let paymentVaultTitleCollectionViewCell = UINib(nibName: "PaymentVaultTitleCollectionViewCell", bundle: self.bundle)
        self.collectionSearch.register(paymentVaultTitleCollectionViewCell, forCellWithReuseIdentifier: "paymentVaultTitleCollectionViewCell")
    }

    func addCallbackCancel() {
        if callbackCancel == nil {

            self.callbackCancel = {[weak self] () -> Void in
                if self?.navigationController?.viewControllers[0] == self {
                    self?.dismiss(animated: true, completion: {})
                } else {
                    self?.navigationController!.popViewController(animated: true)
                }}
        }
    }

    public func numberOfSections(in collectionView: UICollectionView) -> Int {
        return self.viewModel.numberOfSections()
    }

    public func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        collectionView.deselectItem(at: indexPath, animated: true)

        if self.viewModel.isCardItemFor(indexPath: indexPath) {
            let card = self.viewModel.cards![indexPath.row]

            if self.viewModel.hasConfirmPromptText() {
                deleteCardAlertView(card: card, message: self.viewModel.confirmPromptText!)
            } else {
                self.callback(card)
            }

        } else if self.viewModel.isExtraOptionItemFor(indexPath: indexPath) {
            callback(nil)
        }
    }

    func deleteCardAlertView(card: PXCard, message: String) {

        let title = self.viewModel.getAlertCardTitle(card: card)

        let alert = UIAlertController(title: title, message: message, preferredStyle: UIAlertController.Style.alert)
        alert.addAction(UIAlertAction(title: "No".localized, style: UIAlertAction.Style.cancel, handler: nil))
        alert.addAction(UIAlertAction(title: "Si".localized, style: UIAlertAction.Style.default, handler: { (_) -> Void in
            self.callback(card)
        }))

        self.present(alert, animated: true, completion: nil)
    }

    public func collectionView(_ collectionView: UICollectionView,
                               numberOfItemsInSection section: Int) -> Int {
        return self.viewModel.numberOfItemsInSection(section: section)

    }

    public func collectionView(_ collectionView: UICollectionView,
                               cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "searchCollectionCell", for: indexPath) as! PaymentSearchCollectionViewCell

        if self.viewModel.isHeaderSection(section: indexPath.section) {
            let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "paymentVaultTitleCollectionViewCell", for: indexPath) as! PaymentVaultTitleCollectionViewCell
            cell.title.text = self.viewModel.getScreenTitle()
            self.titleSectionReference = cell
            titleCell = cell
            return cell

        } else if self.viewModel.isCardItemFor(indexPath: indexPath) {
            cell.fillCell(drawablePaymentOption: self.viewModel.cards![indexPath.row])

        } else if self.viewModel.isExtraOptionItemFor(indexPath: indexPath) {
            cell.fillCell(optionText: self.viewModel.extraOptionTitle!)
        }
        return cell
    }

    override func scrollPositionToShowNavBar () -> CGFloat {
        return titleCellHeight - navBarHeigth - statusBarHeigth
    }

    public func collectionView(_ collectionView: UICollectionView,
                               layout collectionViewLayout: UICollectionViewLayout,
                               sizeForItemAt indexPath: IndexPath) -> CGSize {

        return viewModel.sizeForItemAt(indexPath: indexPath)
    }

    public func collectionView(_ collectionView: UICollectionView,
                               layout collectionViewLayout: UICollectionViewLayout,
                               insetForSectionAt section: Int) -> UIEdgeInsets {
        return UIEdgeInsets(top: 8, left: 8, bottom: 8, right: 8)

    }

    public func collectionView(_ collectionView: UICollectionView,
                               layout collectionViewLayout: UICollectionViewLayout,
                               minimumLineSpacingForSectionAt section: Int) -> CGFloat {
        return 8
    }

    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        self.didScrollInTable(scrollView)
    }

    fileprivate func hideNavBarCallbackDisplayTitle() -> (() -> Void) {
        return { [weak self] in
            if self?.titleSectionReference != nil {
                self?.titleSectionReference.fillCell()
                self?.titleSectionReference.title.text = self?.viewModel.getScreenTitle()
            }
        }
    }

    override func getNavigationBarTitle() -> String {
        if self.titleSectionReference != nil {
            self.titleSectionReference.title.text = ""
        }
        return self.viewModel.getScreenTitle()
    }

}
