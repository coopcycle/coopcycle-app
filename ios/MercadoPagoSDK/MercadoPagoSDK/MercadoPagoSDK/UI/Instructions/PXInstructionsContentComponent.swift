//
//  PXInstructionsContentComponent.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/15/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

internal class PXInstructionsContentComponent: PXComponentizable {
    var props: PXInstructionsContentProps

    init(props: PXInstructionsContentProps) {
        self.props = props
    }

    func hasInfo() -> Bool {
        return !Array.isNullOrEmpty(props.instruction.info)
    }

    func getInfoComponent() -> PXInstructionsInfoComponent? {
        var content: [String] = []
        var info: [String] = props.instruction.info

        var title = ""
        var hasTitle = false
        if info.count == 1 || (info.count > 1 && info[1] == "") {
            title = info[0]
            hasTitle = true
        }

        var firstSpaceFound = false
        var secondSpaceFound = false
        var hasBottomDivider = false

        for text in info {
            if text.isEmpty {
                if firstSpaceFound {
                    secondSpaceFound = true
                } else {
                    firstSpaceFound = true
                }
            } else {
                if !hasTitle || (firstSpaceFound && !secondSpaceFound) {
                    content.append(text)
                } else if firstSpaceFound && secondSpaceFound {
                    hasBottomDivider = true
                }
            }
        }

        let infoProps = PXInstructionsInfoProps(infoTitle: title, infoContent: content, bottomDivider: hasBottomDivider)
        let infoComponent = PXInstructionsInfoComponent(props: infoProps)
        return infoComponent
    }

    func getReferencesComponent() -> PXInstructionsReferencesComponent? {

        let info: [String] = props.instruction.info
        var spacesFound = 0
        var title = ""
        func isSpaceRepresentation(_ text: String) -> Bool {
            return text.isEmpty
        }
        func isTitleRepresentation() -> Bool {
            return spacesFound == 2
        }

        for text in info {
            if isSpaceRepresentation(text) {
                spacesFound += 1
            } else if isTitleRepresentation() {
                title = text
                break
            }
        }

        let referencesProps = PXInstructionsReferencesProps(title: title, references: props.instruction.references)
        let referencesComponent = PXInstructionsReferencesComponent(props: referencesProps)
        return referencesComponent
    }

    func getInteractionsComponent() -> PXInstructionsInteractionsComponent? {

        let info: [String] = props.instruction.info
        var spacesFound = 0
        var title = ""
        func isSpaceRepresentation(_ text: String) -> Bool {
            return text.isEmpty
        }
        func isTitleRepresentation() -> Bool {
            return spacesFound == 2
        }

        for text in info {
            if isSpaceRepresentation(text) {
                spacesFound += 1
            } else if isTitleRepresentation() {
                title = text
                break
            }
        }

        let interactionsProps = PXInstructionsInteractionsProps(title: title, interactions: props.instruction.interactions)
        let interactiosComponent = PXInstructionsInteractionsComponent(props: interactionsProps)
        return interactiosComponent
    }

    func getTertiaryInfoComponent() -> PXInstructionsTertiaryInfoComponent? {
        let tertiaryInfoProps = PXInstructionsTertiaryInfoProps(tertiaryInfo: props.instruction.tertiaryInfo)
        let tertiaryInfoComponent = PXInstructionsTertiaryInfoComponent(props: tertiaryInfoProps)
        return tertiaryInfoComponent
    }

    func getAccreditationTimeComponent() -> PXInstructionsAccreditationTimeComponent? {
        let accreditationTimeProps = PXInstructionsAccreditationTimeProps(accreditationMessage: props.instruction.accreditationMessage, accreditationComments: props.instruction.accreditationComments)
        let accreditationTimeComponent = PXInstructionsAccreditationTimeComponent(props: accreditationTimeProps)
        return accreditationTimeComponent
    }

    func getActionsComponent() -> PXInstructionsActionsComponent? {
        let actionsProps = PXInstructionsActionsProps(instructionActions: props.instruction.actions)
        let actionsComponent = PXInstructionsActionsComponent(props: actionsProps)
        return actionsComponent
    }

    func hasReferences() -> Bool {
        return !Array.isNullOrEmpty(props.instruction.references)
    }

    func hasInteractions() -> Bool {
        return !Array.isNullOrEmpty(props.instruction.interactions)
    }

    func hasTertiaryInfo() -> Bool {
        return !Array.isNullOrEmpty(props.instruction.tertiaryInfo)
    }

    func hasAccreditationTime() -> Bool {
        return !Array.isNullOrEmpty(props.instruction.accreditationComments) || !String.isNullOrEmpty(props.instruction.accreditationMessage)
    }

    func hasActions() -> Bool {
        if !Array.isNullOrEmpty(props.instruction.actions) {
            for action in props.instruction.actions! where action.tag == PXActionTag.LINK.rawValue {
                return true
            }
        }
        return false
    }

    func needsBottomMargin() -> Bool {
        return hasInfo() || hasReferences() || hasInteractions() || hasAccreditationTime()
    }

    func render() -> UIView {
        return PXInstructionsContentRenderer().render(self)
    }
}

internal class PXInstructionsContentProps {
    var instruction: PXInstruction

    init(instruction: PXInstruction) {
        self.instruction = instruction
    }
}
