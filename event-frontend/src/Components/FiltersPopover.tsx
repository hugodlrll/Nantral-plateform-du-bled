import "./styles/FiltersPopover.scss";
import { Popover, Switch } from "radix-ui";

interface FiltersPopoverProps {
    availableOnly: boolean;
    upcomingOnly: boolean;
    registeredOnly: boolean;
    onAvailableChange: (value: boolean) => void;
    onUpcomingChange: (value: boolean) => void;
    onRegisteredChange: (value: boolean) => void;
    onReset: () => void;
}

export default function FiltersPopover({
    availableOnly,
    upcomingOnly,
    registeredOnly,
    onAvailableChange,
    onUpcomingChange,
    onRegisteredChange,
    onReset,
}: FiltersPopoverProps) {
    return (
        <Popover.Root>
            <Popover.Trigger className="filters-trigger">
                Filtres
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content className="filters-popover" sideOffset={8} align="end">
                    <div className="filter-item">
                        <label className="filter-label">Places disponibles</label>
                        <Switch.Root
                            className="switch-root"
                            checked={availableOnly}
                            onCheckedChange={onAvailableChange}
                        >
                            <Switch.Thumb className="switch-thumb" />
                        </Switch.Root>
                    </div>
                    <div className="filter-item">
                        <label className="filter-label">À venir</label>
                        <Switch.Root
                            className="switch-root"
                            checked={upcomingOnly}
                            onCheckedChange={onUpcomingChange}
                        >
                            <Switch.Thumb className="switch-thumb" />
                        </Switch.Root>
                    </div>
                    <div className="filter-item">
                        <label className="filter-label">Inscrit</label>
                        <Switch.Root
                            className="switch-root"
                            checked={registeredOnly}
                            onCheckedChange={onRegisteredChange}
                        >
                            <Switch.Thumb className="switch-thumb" />
                        </Switch.Root>
                    </div>
                    <button className="clear-filters" type="button" onClick={onReset}>
                        Réinitialiser
                    </button>
                    <Popover.Arrow className="filters-arrow" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
