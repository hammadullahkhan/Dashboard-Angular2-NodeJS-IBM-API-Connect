import { Router, ActivatedRoute } from '@angular/router';
import { OnDestroy } from '@angular/core';

import { TabView, TabViewService, SnackBarService, SnackBarComponent } from '@ericsson/oden/modules';
import { AppHeaderActions } from '@ericsson/oden/core/models/app-header-actions.model';
import { AppHeaderService } from '@ericsson/oden/components/app-header/app-header.service';
import { ActionItem } from '@ericsson/oden/core/models/action-item.model';
import { ModalHelperService } from '@ericsson/oden/components/modal/modal-helper.service';
import { DialogComponent } from '@ericsson/oden/components/modal/dialog/dialog.component';
import { DialogConfig } from '@ericsson/oden/components/modal/dialog/dialog.config';
import { DIALOG_TYPE } from '@ericsson/oden/components/modal/dialog/dialog.constants';


export class EntityCreate extends TabView implements OnDestroy {

    private subscription;
    private dialogSubscription;
    public dialog: DialogComponent;

    discardAction = new ActionItem({ label: 'Cancel', action: 'cancel' });
    deleteAction = new ActionItem({ label: 'Delete', action: 'delete' });
    saveAction = new ActionItem({ label: 'Save', action: 'save', disabled: true });
    primaryAction = new ActionItem({ label: 'Publish', action: 'publish', disabled: true });

    appHeaderActions: AppHeaderActions = new AppHeaderActions({
        discard: this.discardAction,
        save: this.saveAction,
        primary: this.primaryAction
    });

    snackBarActions: ActionItem = new ActionItem({
        // label: LOCALE.CLOSE,
        // action: 'close'
    });

    constructor(
        tabViewService: TabViewService,
        private _appHeaderService: AppHeaderService,
        private _activateRouter: ActivatedRoute,
        private _router: Router,
        private _snackBarService: SnackBarService,
        private _modalHelperService: ModalHelperService
    ) {
        super(tabViewService, _activateRouter);
    }

    init() {
        this.showAppHeaderButtons();
    }

    showAppHeaderButtons() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this._appHeaderService.setActionButtons(this.appHeaderActions);
        this.subscription = this._appHeaderService.onActionItemClicked$.subscribe((a) => this.appHeaderActionClicked(a)
        );
    }

    appHeaderActionClicked(actionItem: ActionItem): void {
        if (actionItem.action === 'cancel') {
            this.onCancel();
        } else if (actionItem.action === 'delete') {
            this.canBeDelete();
        } else if (actionItem.action === 'save') {
            this.onSaved();
        } else if (actionItem.action === 'publish') {
            this.canBePublished();
        }
    }

    canBeDelete() {

    }

    onSaved(title?: string) {

    }

    canBePublished() {

    }

    onPublished(title?: string) {

    }

    onDelete(title?: string) {

    }

    showSnackBar(message: string): void {
        let action = this.snackBarActions;
        let snackBar: SnackBarComponent = this._snackBarService.open(message, action);
        snackBar.onAction.subscribe((actionItem) => this.snackBarActionClicked(snackBar, actionItem));
    }

    snackBarActionClicked(snackBar: SnackBarComponent, actionItem: ActionItem) {
        if (actionItem.action === 'close') {
            snackBar.close();
        }
    }

    showDialog(data: any): void {
        if (this.dialog && this.dialog.isOpen) {
            this.dialog.close();
        }
        let config: DialogConfig = new DialogConfig({
            title: data.title,
            message: data.message,
            actions: data.actions,
            type: DIALOG_TYPE.MANDATORY
        });
        this.dialog = this._modalHelperService.createDialog(config);
        this.dialogSubscription = this.dialog.onAction.subscribe((actionItem) => this.dialogActionClicked(this.dialog, actionItem));
    }

    dialogActionClicked(dialog: DialogComponent, actionItem: ActionItem) {
        if (actionItem.action === 'ok') {
            dialog.close();
        }
    }

    onCancel() {
        this.goBack();
    }

    goBack() {
        let backRoute = ['../'];
        this._router.navigate(backRoute, { relativeTo: this._activateRouter });
    }

    ngOnDestroy() {

        this._appHeaderService.setActionButtons(null);
    }
}
