//
//  PXOfflineMethodsViewModel.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 18/12/2019.
//

import Foundation

final class PXOfflineMethodsViewModel: PXReviewViewModel {

    let paymentTypes: [PXOfflinePaymentType]
    var paymentMethods: [PXPaymentMethod] = [PXPaymentMethod]()
    private let payerCompliance: PXPayerCompliance?

    var selectedIndexPath: IndexPath?

    public init(offlinePaymentTypes: [PXOfflinePaymentType], paymentMethods: [PXPaymentMethod], amountHelper: PXAmountHelper, paymentOptionSelected: PaymentMethodOption?, advancedConfig: PXAdvancedConfiguration, userLogged: Bool, disabledOption: PXDisabledOption? = nil, payerCompliance: PXPayerCompliance?) {
        self.paymentTypes = PXOfflineMethodsViewModel.filterPaymentTypes(offlinePaymentTypes: offlinePaymentTypes)
        self.paymentMethods = paymentMethods
        self.payerCompliance = payerCompliance
        super.init(amountHelper: amountHelper, paymentOptionSelected: paymentOptionSelected, advancedConfig: advancedConfig, userLogged: userLogged, escProtocol: nil)
    }

    func getTotalTitle() -> PXText {
        let amountString = Utils.getAmountFormated(amount: amountHelper.amountToPay, forCurrency: SiteManager.shared.getCurrency())
        let totalString = "Total".localized + " \(amountString)"

        return PXText(message: totalString, backgroundColor: nil, textColor: nil, weight: "semi_bold")
    }

    func numberOfSections() -> Int {
        return paymentTypes.count
    }

    func numberOfRowsInSection(_ section: Int) -> Int {
        return paymentTypes[section].paymentMethods.count
    }

    func heightForRowAt(_ indexPath: IndexPath) -> CGFloat {
        return 82
    }

    func dataForCellAt(_ indexPath: IndexPath) -> PXOfflineMethodsCellData {
        let isSelected: Bool = selectedIndexPath == indexPath
        let model = paymentTypes[indexPath.section].paymentMethods[indexPath.row]

        let paymentTypeId = paymentTypes[indexPath.section].id
        let imageKey = model.instructionId != paymentTypeId ? model.id + "_" + model.instructionId : model.id
        let image = ResourceManager.shared.getImageForPaymentMethod(withDescription: imageKey)
        return PXOfflineMethodsCellData(title: model.name, subtitle: model.description, image: image, isSelected: isSelected)
    }

    func headerTitleForSection(_ section: Int) -> PXText? {
        return paymentTypes[section].name
    }

    func getTitleForLastSection() -> String? {
        if let message = paymentTypes.last?.name?.message {
            return message.lowercased().firstCapitalized
        }
        return nil
    }

    func getSelectedOfflineMethod() -> PXOfflinePaymentMethod? {
        guard let selectedIndex = selectedIndexPath else {
            return nil
        }

        return paymentTypes[selectedIndex.section].paymentMethods[selectedIndex.row]
    }

    func getPaymentMethod(targetId: String) -> PXPaymentMethod? {
        return Utils.findPaymentMethod(paymentMethods, paymentMethodId: targetId)
    }

    func getOfflinePaymentMethod(targetOfflinePaymentMethod: PXOfflinePaymentMethod) -> PXPaymentMethod? {
        return Utils.findOfflinePaymentMethod(paymentMethods, offlinePaymentMethod: targetOfflinePaymentMethod)
    }

    func getPayerCompliance() -> PXPayerCompliance? {
        return payerCompliance
    }

    func getPayerFirstName() -> String? {
        return payerCompliance?.offlineMethods.sensitiveInformation?.firstName
    }

    func getPayerLastName() -> String? {
        return payerCompliance?.offlineMethods.sensitiveInformation?.lastName
    }

    func getPayerIdentification() -> PXIdentification? {
        return payerCompliance?.offlineMethods.sensitiveInformation?.identification
    }
}

// MARK: Privates
private extension PXOfflineMethodsViewModel {
    class func filterPaymentTypes(offlinePaymentTypes: [PXOfflinePaymentType]) -> [PXOfflinePaymentType] {
        var filteredOfflinePaymentTypes: [PXOfflinePaymentType] = [PXOfflinePaymentType]()
        var filteredPaymentMethods: [PXOfflinePaymentMethod] = [PXOfflinePaymentMethod]()

        for paymentType in offlinePaymentTypes {
            for paymentMethod in paymentType.paymentMethods where paymentMethod.status.enabled {
                filteredPaymentMethods.append(paymentMethod)
            }
            let offlinePaymentType = PXOfflinePaymentType(id: paymentType.id, name: paymentType.name, paymentMethods: filteredPaymentMethods)
            filteredOfflinePaymentTypes.append(offlinePaymentType)
            filteredPaymentMethods.removeAll()
        }
        return filteredOfflinePaymentTypes
    }
}

// MARK: Tracking OfflineMethods
extension PXOfflineMethodsViewModel {
    func getScreenTrackingProperties() -> [String: Any] {
        var infoArray: [[String: Any]] = [[String: Any]]()
        for paymentType in paymentTypes {
            for paymentMethod in paymentType.paymentMethods {
                var info: [String: Any] = [:]
                info["payment_method_type"] = paymentType.id
                info["payment_method_id"] = paymentMethod.id
                infoArray.append(info)
            }
        }
        var availableMethods: [String: Any] = [String: Any]()
        availableMethods["available_methods"] = infoArray
        return availableMethods
    }

    func getEventTrackingProperties(_ selectedOfflineMethod: PXOfflinePaymentMethod) -> [String: Any] {
        var properties: [String: Any] = [String: Any]()
        properties["payment_method_type"] = selectedOfflineMethod.instructionId
        properties["payment_method_id"] = selectedOfflineMethod.id
        properties["review_type"] = "one_tap"
        var info: [String: Any] = [:]
        info["has_payer_information"] = getPayerCompliance()?.offlineMethods.isCompliant
        info["additional_information_needed"] = selectedOfflineMethod.hasAdditionalInfoNeeded
        properties["extra_info"] = info
        return properties
    }
}
