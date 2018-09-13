import { ActivatedRoute, Router } from '@angular/router';
import { OnDestroy, OnChanges } from '@angular/core';

import { TabView, TabViewService, SnackBarService, SnackBarComponent } from '@ericsson/oden/modules';
import { ActionItem } from '@ericsson/oden/core';
import { ModalHelperService } from '@ericsson/oden/components/modal/modal-helper.service';
import { DialogComponent } from '@ericsson/oden/components/modal/dialog/dialog.component';
import { DialogConfig } from '@ericsson/oden/components/modal/dialog/dialog.config';
import { DIALOG_TYPE } from '@ericsson/oden/components/modal/dialog/dialog.constants';

export class EntityListing extends TabView implements OnDestroy, OnChanges {
    private dialogSubscription;
    public dialog: DialogComponent;
    public batchActionClicked: boolean = false;
    public singleActionClicked: boolean = false;
    public displayTableData: any[];
    public tableData: any[];
    deleteBatchAction = new ActionItem({ label: 'Delete', action: 'delete' });
    deletePublishAction = new ActionItem({ label: 'Publish', action: 'publish' });

    editSingleAction = new ActionItem({ label: 'Edit', action: 'edit' });
    publishSingleAction = new ActionItem({ label: 'Publish', action: 'publish' });
    deleteSingleAction = new ActionItem({ label: 'Delete', action: 'delete' });

    tableSingleActions: Array<ActionItem> = [
        this.editSingleAction, this.publishSingleAction, this.deleteSingleAction
    ];

    tableBatchActions: Array<ActionItem> = [
        this.deleteBatchAction, this.deletePublishAction
    ];

    snackBarActions: ActionItem = new ActionItem({
        // label: LOCALE.CLOSE,
        // action: 'close'
    });

    constructor(
        private superTabViewService: TabViewService,
        private _router: Router,
        private _activateRouter: ActivatedRoute,
        private snackBarService: SnackBarService,
        private modalHelperService: ModalHelperService
    ) {
        super(superTabViewService, _activateRouter);
    }

    ngOnChanges() {
        super.ngOnChanges();
    }

    create() {
        this._router.navigate(['./new'], { relativeTo: this._activateRouter });
    }

    tableSingleActionPressed(tableAction): void {
        this.batchActionClicked = false;
        let messageTitle = '';
        this.tableActionPressed(tableAction, messageTitle);
    }

    tableBatchActionPressed(tableAction): void {
        let messageTitle = '';
        this.tableActionPressed(tableAction, messageTitle);
    }

    tableActionPressed(tableAction, messageTitle): void {

        if (tableAction.action === 'delete') {

        } else if (tableAction.action === 'publish') {

        }
    }

    setTableData(tableData: any[]) {
        this.displayTableData = tableData;
        this.tableData = tableData;
    }

    showSnackBar(message: string): void {
        let action = this.snackBarActions;
        let snackBar: SnackBarComponent = this.snackBarService.open(message, action);
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
        this.dialog = this.modalHelperService.createDialog(config);
        this.dialogSubscription = this.dialog.onAction.subscribe((actionItem) => this.dialogActionClicked(this.dialog, actionItem));
    }

    dialogActionClicked(dialog: DialogComponent, actionItem: ActionItem) {
        if (actionItem.action === 'ok') {
            dialog.close();
        } else if (actionItem.action === 'delete') {
            dialog.close();
            this.onDelete();
        } else if (actionItem.action === 'publish') {
            dialog.close();
            this.onPublish();
        }
    }

    protected onDelete(deletedItem?: any) {

        // this.showSnackBar(message);
    }

    protected onPublish(publishedItem?: any) {

        // this.showSnackBar(message);
    }

    protected showLoader() {
        if (this.superTabViewService.loader) {
            this.superTabViewService.loader.show();
        }
    }

    protected hideLoader() {
        setTimeout(() => {
            if (this.superTabViewService.loader) {
                this.superTabViewService.loader.hide();
            }
        }, 1000);
    }

    ngOnDestroy(): void {
        if (this.superTabViewService.loader) {
            this.superTabViewService.loader.hide();
        }
        if (this.dialogSubscription) {
            this.dialogSubscription.unsubscribe();
        }
    }
}
