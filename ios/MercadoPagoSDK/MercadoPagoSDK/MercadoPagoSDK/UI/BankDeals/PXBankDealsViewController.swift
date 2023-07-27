//
//  PXBankDealsViewController.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 7/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit

class PXBankDealsViewController: MercadoPagoUIViewController, UICollectionViewDataSource, UICollectionViewDelegateFlowLayout, UICollectionViewDelegate {

    fileprivate let MARGINS: CGFloat = PXLayout.S_MARGIN
    fileprivate let CELL_HEIGHT: CGFloat = 128

    fileprivate var viewModel: PXBankDealsViewModel

    init(viewModel: PXBankDealsViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        self.title = "bank_deals_screen_title".localized
        createCollectionView()
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        trackScreen()
    }

    func createCollectionView() {
        //Collection View Flow Layout
        let layout = UICollectionViewFlowLayout()
        layout.minimumInteritemSpacing = MARGINS
        layout.minimumLineSpacing = MARGINS

        //Collection View
        let collectionView = UICollectionView(frame: self.view.bounds, collectionViewLayout: layout)
        collectionView.translatesAutoresizingMaskIntoConstraints = false
        self.view.addSubview(collectionView)
        collectionView.delegate = self
        collectionView.dataSource = self
        collectionView.backgroundColor = .white

        //Register Cells
        collectionView.register(PXBankDealCollectionCell.self, forCellWithReuseIdentifier: PXBankDealCollectionCell.REUSE_IDENTIFIER)

        //Constraints
        PXLayout.matchWidth(ofView: collectionView).isActive = true
        PXLayout.centerHorizontally(view: collectionView).isActive = true
        PXLayout.pinTop(view: collectionView).isActive = true
        PXLayout.pinBottom(view: collectionView).isActive = true
    }

    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return self.viewModel.bankDeals.count
    }

    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        if let cell = collectionView.dequeueReusableCell(withReuseIdentifier: PXBankDealCollectionCell.REUSE_IDENTIFIER, for: indexPath) as? PXBankDealCollectionCell {
            let bankDealComponentView = self.buildBankDealComponentView(for: indexPath)
            cell.contentView.addSubview(bankDealComponentView)

            //Constraints
            PXLayout.centerHorizontally(view: bankDealComponentView).isActive = true
            PXLayout.centerVertically(view: bankDealComponentView).isActive = true
            PXLayout.matchWidth(ofView: bankDealComponentView).isActive = true
            PXLayout.setHeight(owner: bankDealComponentView, height: CELL_HEIGHT).isActive = true

            return cell
        }
        return UICollectionViewCell()
    }

    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        return getCellSize()
    }

    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, insetForSectionAt section: Int) -> UIEdgeInsets {
        return UIEdgeInsets(top: MARGINS, left: MARGINS, bottom: MARGINS, right: MARGINS)
    }

    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let viewController = self.viewModel.getBankDealDetailsViewControllerForIndexPath(indexPath)
        self.navigationController?.pushViewController(viewController, animated: true)
    }

    func getCellSize() -> CGSize {
        let screenWidth = PXLayout.getScreenWidth()
        let width: CGFloat = screenWidth / 2 - MARGINS * 2
        return CGSize(width: width, height: CELL_HEIGHT)
    }
}

// MARK: Component Builders
extension PXBankDealsViewController {
    fileprivate func buildBankDealComponentView(for indexPath: IndexPath) -> UIView {
        let component = self.viewModel.getBankDealComponentForIndexPath(indexPath)
        let view = component.render()
        return view
    }
}

// MARK: Tracking
extension PXBankDealsViewController {
    func trackScreen() {
        trackScreen(path: TrackingPaths.Screens.getBankDealsPath())
    }
}
