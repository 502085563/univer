import { BaseComponentRender, BaseComponentSheet, BaseMenuItem, Component, ComponentChildren, joinClassNames } from '@univerjs/base-component';
import styles from './index.module.less';

export interface BaseItemProps extends BaseMenuItem {
    selected?: boolean;
    suffix?: ComponentChildren;
    border?: boolean;
}

export class Item extends Component<BaseItemProps> {
    Render: BaseComponentRender;

    initialize() {
        const component = this._context.getPluginManager().getPluginByName<BaseComponentSheet>('ComponentSheet')!;
        this.Render = component.getComponentRender();
    }

    render() {
        const CorrectIcon = this.Render.renderFunction('CorrectIcon');
        const { selected, label, suffix, disabled } = this.props;
        return (
            <div className={joinClassNames(styles.selectItem, disabled ? styles.selectDisabledItem : '')}>
                {selected ? (
                    <span className={styles.selectItemSelected}>
                        <CorrectIcon />
                    </span>
                ) : (
                    ''
                )}
                <span className={styles.selectItemContent}>{label}</span>
                {suffix ? <span className={styles.selectItemSuffix}>{suffix}</span> : ''}
            </div>
        );
    }
}
