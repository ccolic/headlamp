import { useTranslation } from 'react-i18next';
import PersistentVolume from '../../lib/k8s/persistentVolume';
import { LightTooltip, Link } from '../common';
import LabelListItem from '../common/LabelListItem';
import ResourceListView from '../common/Resource/ResourceListView';
import { makePVStatusLabel } from './VolumeDetails';

export default function VolumeList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('Persistent Volumes')}
      headerProps={{
        noNamespaceFilter: true,
      }}
      resourceClass={PersistentVolume}
      columns={[
        'name',
        {
          id: 'className',
          label: t('Class Name'),
          getter: volume => volume.spec.storageClassName ?? '',
          render: volume => {
            const name = volume.spec.storageClassName;
            if (!name) {
              return '';
            }
            return (
              <Link routeName="storageClass" params={{ name }} tooltip>
                {name}
              </Link>
            );
          },
        },
        {
          id: 'capacity',
          label: t('Capacity'),
          getter: volume => volume.spec.capacity.storage,
        },
        {
          id: 'accessModes',
          label: t('Access Modes'),
          getter: volume => volume?.spec?.accesModes?.join(', '),
          render: volume => <LabelListItem labels={volume?.spec?.accessModes || []} />,
        },
        {
          id: 'reclaimPolicy',
          label: t('Reclaim Policy'),
          getter: volume => volume.spec.persistentVolumeReclaimPolicy,
        },
        {
          id: 'reason',
          label: t('translation|Reason'),
          getter: volume => volume.status.reason,
          render: volume => {
            const reason = volume.status.reason;
            return <LightTooltip title={reason}>{reason}</LightTooltip>;
          },
          show: false,
        },
        {
          id: 'claim',
          label: t('Claim'),
          getter: volume => volume.spec?.claimRef?.name ?? '',
          render: volume => {
            const claim = volume.spec.claimRef?.name;
            if (!claim) {
              return null;
            }
            const claimNamespace = volume.spec.claimRef?.namespace;

            return (
              <Link
                routeName="persistentVolumeClaim"
                params={{ name: claim, namespace: claimNamespace }}
                tooltip
              >
                {claim}
              </Link>
            );
          },
        },
        {
          id: 'status',
          label: t('translation|Status'),
          getter: volume => volume.status?.phase,
          render: volume => makePVStatusLabel(volume),
        },
        'age',
      ]}
    />
  );
}
